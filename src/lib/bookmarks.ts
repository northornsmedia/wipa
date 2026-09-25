import { supabase } from '@/lib/supabase';

export interface BookmarkedPost {
  id: string;
  author_id: string;
  content: string;
  media_urls?: string[];
  media_type?: string | null;
  document_name?: string | null;
  privacy?: string;
  likes_count: number;
  comments_count: number;
  comments_disabled?: boolean;
  created_at: string;
  saved_at?: string;
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    role?: string;
    company?: string;
    practice_area?: string;
    is_wipa_recommended?: boolean;
  };
}

const getStorageKey = (userId: string) => `wipa_saved_posts_${userId}`;

/**
 * Get all saved post IDs for a given user from local cache and Supabase
 */
export async function getSavedPostIds(userId?: string): Promise<string[]> {
  if (!userId) return [];
  
  let localIds: string[] = [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) localIds = JSON.parse(raw);
  } catch {}

  try {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', userId);

    if (!error && data && Array.isArray(data)) {
      const dbIds = data.map((r: any) => String(r.post_id));
      const merged = Array.from(new Set([...localIds, ...dbIds]));
      localStorage.setItem(getStorageKey(userId), JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Error fetching saved post IDs from Supabase:', err);
  }

  return localIds;
}

/**
 * Toggle bookmark state for a post.
 * Updates both localStorage and Supabase `saved_posts` table.
 * Emits a 'wipa:bookmarks-updated' CustomEvent so all open views update immediately.
 */
export async function toggleBookmark(postId: string, userId?: string): Promise<{ isSaved: boolean; error?: string }> {
  if (!userId) return { isSaved: false, error: 'User not authenticated' };

  const normalizedId = String(postId);
  const storageKey = getStorageKey(userId);
  let localIds: string[] = [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) localIds = JSON.parse(raw);
  } catch {}

  const wasSaved = localIds.includes(normalizedId);
  const nextIds = wasSaved 
    ? localIds.filter(id => id !== normalizedId)
    : [...localIds, normalizedId];

  // Immediate local persistence
  localStorage.setItem(storageKey, JSON.stringify(nextIds));

  // Notify active components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wipa:bookmarks-updated', {
      detail: { postId: normalizedId, isSaved: !wasSaved, userId }
    }));
  }

  // Database persistence
  try {
    if (wasSaved) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .match({ user_id: userId, post_id: normalizedId });
      
      if (error) console.warn('Supabase delete saved_posts warning:', error.message);
      return { isSaved: false };
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .upsert(
          { user_id: userId, post_id: normalizedId },
          { onConflict: 'user_id,post_id', ignoreDuplicates: true }
        );

      if (error) console.warn('Supabase upsert saved_posts warning:', error.message);
      return { isSaved: true };
    }
  } catch (err: any) {
    console.error('Error toggling bookmark in DB:', err);
    return { isSaved: !wasSaved, error: err.message };
  }
}

/**
 * Fetch complete bookmarked posts with author information
 */
export async function getBookmarkedPosts(userId?: string): Promise<BookmarkedPost[]> {
  if (!userId) return [];

  // 1. Get saved post IDs and timestamps
  let savedList: { post_id: string; created_at?: string }[] = [];

  try {
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      savedList = data.map((row: any) => ({
        post_id: String(row.post_id),
        created_at: row.created_at
      }));
    }
  } catch (err) {
    console.warn('Error fetching saved_posts table:', err);
  }

  // Fallback to local storage if DB empty or offline
  if (savedList.length === 0) {
    try {
      const raw = localStorage.getItem(getStorageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        savedList = parsed.map((id: string) => ({ post_id: String(id) }));
      }
    } catch {}
  }

  if (savedList.length === 0) return [];

  const postIds = savedList.map(s => s.post_id);

  // 2. Fetch full post details from feed_posts
  try {
    const { data: postsData, error: postsErr } = await supabase
      .from('feed_posts')
      .select(`
        id, author_id, content, media_urls, media_type, document_name, privacy,
        likes_count, comments_count, comments_disabled, created_at, group_id, post_to_feed,
        author:profiles!feed_posts_author_id_fkey(id, full_name, avatar_url, role, company, practice_area, is_wipa_recommended)
      `)
      .in('id', postIds);

    if (postsErr) {
      console.error('Error fetching feed_posts for bookmarks:', postsErr);
      return [];
    }

    if (!postsData || !Array.isArray(postsData)) return [];

    // Map saved_at timestamp and sort according to save order
    const postsMap = new Map(postsData.map((p: any) => [String(p.id), p]));
    const orderedPosts: BookmarkedPost[] = [];

    for (const item of savedList) {
      const post = postsMap.get(item.post_id);
      if (post) {
        orderedPosts.push({
          ...post,
          saved_at: item.created_at || post.created_at
        });
      }
    }

    return orderedPosts;
  } catch (err) {
    console.error('Failed to get bookmarked posts:', err);
    return [];
  }
}
