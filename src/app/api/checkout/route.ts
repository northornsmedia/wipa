import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder').trim(), {
  apiVersion: '2023-10-16' as any, // Using an older API version string or generic type fallback if needed.
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    const userId = searchParams.get('userId');

    if (!tier || !userId) {
      return NextResponse.json({ error: 'Tier and userId are required' }, { status: 400 });
    }

    // Map the tier to dynamic price details
    const tierConfig: Record<string, { name: string; amountPence: number; interval: 'month' | 'year' }> = {
      student: { name: 'WIPA Student Membership', amountPence: 9900, interval: 'year' },
      professional: { name: 'WIPA IP Professional Membership', amountPence: 29900, interval: 'year' },
      ip_professional: { name: 'WIPA IP Professional Membership', amountPence: 29900, interval: 'year' },
      startup: { name: 'WIPA Startup Membership', amountPence: 49900, interval: 'year' },
      'start-ups': { name: 'WIPA Startup Membership', amountPence: 49900, interval: 'year' },
    };

    const selectedTier = tierConfig[tier.toLowerCase()] || {
      name: `WIPA ${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership`,
      amountPence: 19900,
      interval: 'year'
    };

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000';
    
    // Set pending_tier in user_metadata so webhook knows what they bought
    const { createClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
    );
    
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { pending_tier: tier.toLowerCase() }
    });

    // Create a Stripe Checkout Session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: selectedTier.name,
                description: 'Official Women\'s IP World Alliance Membership with global network access.',
              },
              unit_amount: selectedTier.amountPence,
              recurring: {
                interval: selectedTier.interval,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${appUrl}/platform?success=true`,
        cancel_url: `${appUrl}/platform?canceled=true`,
        client_reference_id: userId,
      });

      if (!session.url) {
        throw new Error('Failed to create Stripe session');
      }

      return NextResponse.redirect(session.url);
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      return NextResponse.json(
        { error: error?.raw?.message || error?.message || 'Internal Server Error' },
        { status: error?.statusCode || error?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error?.raw?.message || error?.message || 'Internal Server Error' },
      { status: error?.statusCode || error?.status || 500 }
    );
  }
}
