import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { postId, userId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const resolvedUserId = userId || 'f6e418d5-19b7-490b-8b0e-fbcdcfa5ac36';

    const { data: existingLike } = await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', resolvedUserId)
      .maybeSingle();

    let isLiked = false;
    if (existingLike) {
      await supabase
        .from('forum_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', resolvedUserId);
      isLiked = false;
    } else {
      await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: resolvedUserId
        });
      isLiked = true;
    }

    const { count } = await supabase
      .from('forum_post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({ success: true, isLiked, likesCount: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
