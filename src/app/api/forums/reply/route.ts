import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { postId, content, authorId } = await req.json();

    if (!postId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const resolvedAuthorId = authorId || 'f6e418d5-19b7-490b-8b0e-fbcdcfa5ac36';

    const { data: reply, error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: postId,
        author_id: resolvedAuthorId,
        content: content.trim()
      })
      .select(`
        *,
        author:profiles(id, full_name, avatar_url, role, company, is_wipa_recommended)
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
