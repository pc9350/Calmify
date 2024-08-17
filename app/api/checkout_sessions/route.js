import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

// const formatAmountForStripe = (amount) => {
//   return Math.round(amount * 100);
// };

export async function POST(req) {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL;

    if (!origin) {
      throw new Error("Base URL is not defined. Please set NEXT_PUBLIC_BASE_URL in your environment variables.");
    }

    const params = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Subscription",
            },
            unit_amount: 999,
            recurring: {
              interval: "month",
              //   interval_count: 1,
            },
          },

          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/result/cancel`,
    };
    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the checkout session." },
      { status: 500 }
    );
  }
}
