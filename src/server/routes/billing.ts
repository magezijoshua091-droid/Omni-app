import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../auth";
import { stripe } from "../stripe";

const router = Router();

router.post("/checkout", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { plan } = req.body; // 'PRO' or 'BUSINESS'
    
    // In a real app, you'd map these to Stripe Price IDs
    const priceId = plan === "PRO" ? "price_pro_dummy" : "price_business_dummy";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.APP_URL}/pricing?canceled=true`,
      client_reference_id: req.user!.id,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any;
      const userId = session.client_reference_id;
      
      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            status: "active",
            plan: "PRO", // Determine based on session
          },
          create: {
            userId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            status: "active",
            plan: "PRO",
          },
        });
        
        await prisma.user.update({
          where: { id: userId },
          data: { role: "PRO" },
        });
      }
      break;
    // ... handle other events
  }

  res.json({ received: true });
});

export default router;
