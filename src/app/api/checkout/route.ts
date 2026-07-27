import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
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

    // Map the tier string to a Stripe Price ID
    // TODO: These should be replaced with actual Stripe Price IDs
    const priceMap: Record<string, string> = {
      student: 'price_1TxoecDqu26YmlnJtrhKDyCY',
      professional: 'price_1Txof6Dqu26YmlnJDHgSlHxu',
      ip_professional: 'price_1Txof6Dqu26YmlnJDHgSlHxu',
      startup: 'price_1TxofRDqu26YmlnJnMDLJ4xu',
      'start-ups': 'price_1TxofRDqu26YmlnJnMDLJ4xu',
    };

    const priceId = priceMap[tier.toLowerCase()];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000';

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Change to 'payment' if these are one-time fees
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
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
