import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, action, reason } = body;

    if (!businessId || !action) {
      return NextResponse.json({ error: 'Missing businessId or action' }, { status: 400 });
    }

    if (action === 'approve') {
      // 1. Fetch current business profile
      const { data: business, error: fetchError } = await supabaseAdmin
        .from('business_profiles')
        .select('*')
        .eq('id', businessId)
        .single();

      if (fetchError || !business) {
        return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
      }

      // 2. Mark business as approved and verified
      const { error: updateError } = await supabaseAdmin
        .from('business_profiles')
        .update({
          status: 'approved',
          is_verified: true,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update business profile: ' + updateError.message }, { status: 500 });
      }

      // 3. Upsert into ip_firms so it appears in the IP Firms directory
      const firmData = {
        name: business.name,
        slug: business.slug,
        logo_url: business.logo_url || null,
        cover_image_url: business.cover_image_url || null,
        description: business.description || business.tagline || null,
        website_url: business.website_url || null,
        linkedin_url: business.linkedin_url || null,
        headquarters: business.headquarters || null,
        size_range: business.company_size || '1-10',
        founded_year: business.founded_year || null,
        specializations: business.specializations || [],
        is_verified: true,
        is_featured: false,
        is_claimed: true,
        claimed_by: business.owner_id || null,
        claimed_at: new Date().toISOString(),
        contact_email: business.contact_email || null,
        phone: business.phone || null,
        updated_at: new Date().toISOString()
      };

      const { data: existingFirm } = await supabaseAdmin
        .from('ip_firms')
        .select('id')
        .eq('slug', business.slug)
        .maybeSingle();

      if (existingFirm) {
        await supabaseAdmin
          .from('ip_firms')
          .update(firmData)
          .eq('id', existingFirm.id);
      } else {
        await supabaseAdmin
          .from('ip_firms')
          .insert({
            ...firmData,
            created_at: new Date().toISOString()
          });
      }

      return NextResponse.json({ 
        success: true, 
        message: `Business "${business.name}" has been approved and published to the platform!`,
        slug: business.slug
      });
    }

    if (action === 'reject') {
      const { error: rejectError } = await supabaseAdmin
        .from('business_profiles')
        .update({
          status: 'rejected',
          is_verified: false,
          rejection_reason: reason || 'Requirements not met at this time.',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (rejectError) {
        return NextResponse.json({ error: rejectError.message }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Business profile marked as rejected.' 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in review route:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
