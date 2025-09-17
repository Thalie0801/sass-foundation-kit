import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const signatureHeader = req.headers["stripe-signature"];
  const signature = Array.isArray(signatureHeader)
    ? signatureHeader[0]
    : signatureHeader;

  if (!signature) {
    res.status(400).json({ error: "Missing Stripe signature header." });
    return;
  }

  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: `Webhook Error: ${message}` });
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log(`Received Stripe event: ${event.type}`, event.data.object);
      // TODO: Propagate the event to Supabase for persistence or additional processing.
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
