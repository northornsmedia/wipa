import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { userId, practiceAreas, experienceYears, availability, mentorshipBio, motivation } = await req.json();

    const supabase = getSupabaseServerClient();
    const resolvedUserId = userId || 'f6e418d5-19b7-490b-8b0e-fbcdcfa5ac36';

    // Update user profile with mentor info
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        skills: practiceAreas?.join(', ') || undefined,
        experience_years: experienceYears ? parseInt(experienceYears) : undefined,
        bio: mentorshipBio || undefined
      })
      .eq('id', resolvedUserId)
      .select()
      .maybeSingle();

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: resolvedUserId,
        type: 'mentorship_approved',
        content: 'Your WIPA Mentor Profile has been approved and activated in the directory!',
        link: '/platform/mentorship'
      });

    return NextResponse.json({
      success: true,
      message: 'Mentorship application approved and active',
      profile: updatedProfile
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
