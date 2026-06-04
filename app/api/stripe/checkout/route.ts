import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/app-session";
import { isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured, PREMIUM_PRICE_ID } from "@/lib/stripe";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured on the server." }, { status: 503 });
  }

  const session = await getAppSession();
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  try {
    const stripe = await getStripe();
    const base = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.email,
      line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
      success_url: `${base.replace(/\/$/, "")}/pricing?checkout=success`,
      cancel_url: `${base.replace(/\/$/, "")}/pricing?checkout=cancel`,
      metadata: {
        userId: session.userId,
      },
      subscription_data: {
        metadata: {
          userId: session.userId,
        },
      },
    });

    if (!checkout.url) {
      return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("[stripe checkout]", err);
    return NextResponse.json({ error: "Failed to start checkout." }, { status: 500 });
  }
}
