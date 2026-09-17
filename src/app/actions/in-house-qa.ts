'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const adminDb = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

import { checkIsInHouseCounsel } from '@/lib/in-house-counsels';

const IN_HOUSE_FORUM_ID = '66666666-6666-6666-6666-666666666666';

export async function getInHouseQuestions() {
  try {
    const { data, error } = await adminDb
      .from('forum_posts')
      .select(`
        id,
        title,
        content,
        created_at,
        author:author_id(id, full_name, avatar_url, role, company, membership_tier),
        forum_replies(
          id,
          content,
          created_at,
          author:author_id(id, full_name, avatar_url, role, company, is_wipa_recommended, membership_tier)
        )
      `)
      .eq('forum_id', IN_HOUSE_FORUM_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching in-house questions:', error);
      return { success: false, questions: [], error: error.message };
    }

    return { success: true, questions: data || [] };
  } catch (err: any) {
    return { success: false, questions: [], error: err.message };
  }
}

export async function askInHouseQuestion({
  title,
  content,
  authorId
}: {
  title: string;
  content: string;
  authorId: string;
}) {
  if (!title?.trim() || !content?.trim() || !authorId) {
    return { success: false, error: "Please provide both question title and context." };
  }

  try {
    // Verify author exists in profiles
    const { data: authorProfile, error: profileErr } = await adminDb
      .from('profiles')
      .select('id, full_name')
      .eq('id', authorId)
      .single();

    if (profileErr || !authorProfile) {
      return { success: false, error: "User profile not recognized. Please log in." };
    }

    const { data, error } = await adminDb
      .from('forum_posts')
      .insert({
        forum_id: IN_HOUSE_FORUM_ID,
        author_id: authorId,
        title: title.trim(),
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      return { success: false, error: error.message };
    }

    return { success: true, question: data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function answerInHouseQuestion({
  postId,
  content,
  authorId
}: {
  postId: string;
  content: string;
  authorId: string;
}) {
  if (!postId || !content?.trim() || !authorId) {
    return { success: false, error: "Missing required answer parameters." };
  }

  try {
    // Check if author profile exists in DB
    const { data: profile, error: profileErr } = await adminDb
      .from('profiles')
      .select('*')
      .eq('id', authorId)
      .single();

    if (profileErr || !profile) {
      return { success: false, error: "Profile not found." };
    }

    // Check if target question post exists and find question author
    const { data: post, error: postErr } = await adminDb
      .from('forum_posts')
      .select('id, author_id')
      .eq('id', postId)
      .single();

    if (postErr || !post) {
      return { success: false, error: "Question not found." };
    }

    const isCounsel = checkIsInHouseCounsel(profile);
    const isQuestionAuthor = post.author_id === authorId;

    if (!isCounsel && !isQuestionAuthor) {
      return {
        success: false,
        error: "Access Denied: In this exclusive thread, only verified In-House Counsel and the question author are authorized to reply."
      };
    }

    // Insert reply into database
    const { data, error } = await adminDb
      .from('forum_replies')
      .insert({
        post_id: postId,
        author_id: authorId,
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating in-house reply:', error);
      return { success: false, error: error.message };
    }

    return { success: true, reply: data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
