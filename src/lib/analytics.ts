import { supabase } from '@/lib/supabase';

export interface UserAnalytics {
  profileViews: number;
  profileViewsThisWeek: number;
  profileViewsGrowth: string;
  profileViewsDirection: 'up' | 'down' | 'neutral';
  postImpressions: number;
  postImpressionsThisWeek: number;
  postImpressionsGrowth: string;
  postImpressionsDirection: 'up' | 'down' | 'neutral';
}

const DEFAULT_ANALYTICS: UserAnalytics = {
  profileViews: 0,
  profileViewsThisWeek: 0,
  profileViewsGrowth: '0% this week',
  profileViewsDirection: 'neutral',
  postImpressions: 0,
  postImpressionsThisWeek: 0,
  postImpressionsGrowth: '0% this week',
  postImpressionsDirection: 'neutral',
};

// Generate or retrieve persistent browser session ID for anonymous view deduplication
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = window.sessionStorage.getItem('wipa_session_id');
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    try {
      window.sessionStorage.setItem('wipa_session_id', sid);
    } catch {
      // Storage unavailable
    }
  }
  return sid;
}

/**
 * Record a profile view when someone visits a user's profile
 */
export async function recordProfileView(profileId: string, viewerId?: string | null): Promise<boolean> {
  if (!profileId) return false;
  if (viewerId && viewerId === profileId) return false; // Never count self-views

  // Client-side session deduplication (1 view per profile per session)
  if (typeof window !== 'undefined') {
    const cacheKey = `wipa_pv_${profileId}`;
    if (window.sessionStorage.getItem(cacheKey)) {
      return false;
    }
    try {
      window.sessionStorage.setItem(cacheKey, '1');
    } catch {
      // Ignore sessionStorage errors
    }
  }

  try {
    const sessionId = getSessionId();
    const { data, error } = await supabase.rpc('record_profile_view', {
      p_profile_id: profileId,
      p_viewer_id: viewerId || null,
      p_session_id: sessionId,
    });

    if (error) {
      console.warn('Could not record profile view:', error.message);
      return false;
    }
    return Boolean(data);
  } catch (err) {
    console.warn('Error recording profile view:', err);
    return false;
  }
}

// In-memory set to prevent duplicate post impression calls during feed scrolling
const recordedPostImpressionsInSession = new Set<string>();

/**
 * Record batch post impressions (when posts are viewed in feed or single post view)
 */
export async function recordPostImpressions(
  posts: { postId: string; authorId: string }[],
  viewerId?: string | null
): Promise<number> {
  if (!posts || posts.length === 0) return 0;

  // Filter out self-posts and already recorded impressions in this session
  const validPosts = posts.filter(p => {
    if (!p.postId || !p.authorId) return false;
    if (viewerId && viewerId === p.authorId) return false; // Exclude self post impressions
    if (recordedPostImpressionsInSession.has(p.postId)) return false;
    return true;
  });

  if (validPosts.length === 0) return 0;

  // Mark in session
  validPosts.forEach(p => recordedPostImpressionsInSession.add(p.postId));

  try {
    const payload = validPosts.map(p => ({
      post_id: p.postId,
      author_id: p.authorId,
    }));

    const { data, error } = await supabase.rpc('record_post_impressions', {
      p_impressions: payload,
      p_viewer_id: viewerId || null,
    });

    if (error) {
      console.warn('Could not record post impressions:', error.message);
      return 0;
    }

    return Number(data) || 0;
  } catch (err) {
    console.warn('Error recording post impressions:', err);
    return 0;
  }
}

/**
 * Fetch aggregated analytics for the profile owner
 */
export async function fetchUserAnalytics(userId: string): Promise<UserAnalytics> {
  if (!userId) return DEFAULT_ANALYTICS;

  try {
    const { data, error } = await supabase.rpc('get_user_analytics', {
      target_user_id: userId,
    });

    if (error || !data) {
      console.warn('Error fetching user analytics RPC:', error?.message);
      return DEFAULT_ANALYTICS;
    }

    return {
      profileViews: Number(data.profile_views) || 0,
      profileViewsThisWeek: Number(data.profile_views_this_week) || 0,
      profileViewsGrowth: data.profile_views_growth || '0% this week',
      profileViewsDirection: data.profile_views_direction || 'neutral',
      postImpressions: Number(data.post_impressions) || 0,
      postImpressionsThisWeek: Number(data.post_impressions_this_week) || 0,
      postImpressionsGrowth: data.post_impressions_growth || '0% this week',
      postImpressionsDirection: data.post_impressions_direction || 'neutral',
    };
  } catch (err) {
    console.error('Failed to load user analytics:', err);
    return DEFAULT_ANALYTICS;
  }
}
