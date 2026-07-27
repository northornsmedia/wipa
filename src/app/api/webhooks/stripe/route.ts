import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id;
      
      if (!userId) {
        console.error('No client_reference_id found in session');
        return NextResponse.json({ error: 'No user ID' }, { status: 400 });
      }

      // 1. Get the pending tier from user metadata
      const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (userError || !user) {
        console.error('User not found:', userError);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const tier = user.user_metadata?.pending_tier;

      if (!tier) {
        console.warn(`User ${userId} completed checkout but had no pending_tier`);
      }

      // 2. Update the user's profile with the new tier
      const finalTier = tier || 'professional'; // Fallback if missing
      
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ membership_tier: finalTier })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
      }

      // 3. Remove pending_tier from auth metadata
      const newMetadata = { ...user.user_metadata };
      delete newMetadata.pending_tier;

      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: newMetadata
      });

      console.log(`Successfully upgraded user ${userId} to ${finalTier}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Unhandled webhook error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
