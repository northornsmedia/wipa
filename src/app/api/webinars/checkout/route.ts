import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Fetch user details
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name, is_admin')
      .eq('id', userId)
      .single();

    // 2. Check how many webinars this user has previously submitted / hosted
    const { data: pastWebinars, error: webErr } = await supabaseAdmin
      .from('webinars')
      .select('id')
      .or(`author_id.eq.${userId},submitter_id.eq.${userId}`);

    const isFirstEvent = !pastWebinars || pastWebinars.length === 0;
    const amountPence = isFirstEvent ? 19900 : 49900; // £199.00 or £499.00 GBP

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: isFirstEvent ? 'WIPA Webinar Host — First Event Offer' : 'WIPA Webinar Host — Standard Tier',
              description: 'Live interactive masterclass broadcast on Meetn with permanent WIPA Resource Library archiving.',
              images: ['https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'],
            },
            unit_amount: amountPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: profile?.email || undefined,
      client_reference_id: userId,
      metadata: {
        userId,
        type: 'webinar_host',
        isFirstEvent: String(isFirstEvent),
        amountGbp: isFirstEvent ? '199' : '499',
      },
      success_url: `${origin}/platform/resources/webinars/create?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/platform/resources/webinars/host?canceled=true`,
    });

    if (!session.url) {
      throw new Error('Failed to create Stripe Checkout session');
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Webinar checkout session error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
