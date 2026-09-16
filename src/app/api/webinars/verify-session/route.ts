import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the session directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        paid: true,
        amountGbp: session.metadata?.amountGbp || (session.amount_total ? session.amount_total / 100 : 199),
        customerEmail: session.customer_email || session.customer_details?.email || null,
        sessionId: session.id,
        isFirstEvent: session.metadata?.isFirstEvent === 'true',
        userId: session.metadata?.userId || session.client_reference_id || null,
      });
    }

    return NextResponse.json({
      paid: false,
      status: session.payment_status,
      message: 'Payment has not been completed',
    });
  } catch (error: any) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: error.message || 'Verification Failed' }, { status: 500 });
  }
}
