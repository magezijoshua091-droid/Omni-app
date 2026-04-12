import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";

export const stripe = new Stripe(stripeSecret, {
  apiVersion: "2026-03-25.dahlia" as any,
  appInfo: {
    name: "Omni SaaS",
    version: "1.0.0",
  },
});
