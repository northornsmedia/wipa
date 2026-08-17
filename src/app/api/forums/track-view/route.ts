import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    // Call an RPC function or just increment directly via update if we assume minimal collisions, 
    // but the best way in Supabase without RPC for a simple counter is sometimes fetching and adding, 
    // or better yet, we just trigger the update. Wait, we can't do x = x + 1 directly with update easily without RPC.
    // Let's use a small workaround or just fetch and update for the prototype.
    const { data: post, error: fetchError } = await supabase
      .from('forum_posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', postId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
