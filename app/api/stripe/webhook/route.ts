import { NextResponse } from "next/server";
import { Plan } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe webhook configuration." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook verify]", err);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: Plan.PREMIUM_GOLD },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: Plan.FREE },
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
