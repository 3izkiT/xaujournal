import type Stripe from "stripe";

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID ?? "";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && PREMIUM_PRICE_ID);
}

let stripeClient: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripeClient) {
    const { default: StripeSdk } = await import("stripe");
    stripeClient = new StripeSdk(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}
