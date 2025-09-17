import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

type PlanKey = "starter" | "essential" | "pro";

type CheckoutRequestBody = {
  plan?: PlanKey | string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

const planPriceMap: Record<PlanKey, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  essential: process.env.STRIPE_PRICE_ESSENTIAL,
  pro: process.env.STRIPE_PRICE_PRO,
};

function getHeaderValue(
  req: VercelRequest,
  headerName: string,
): string | undefined {
  const header = req.headers[headerName.toLowerCase()];

  if (!header) {
    return undefined;
  }

  return Array.isArray(header) ? header[0] : header;
}

function resolveBaseUrl(req: VercelRequest): string {
  const explicitBaseUrl = process.env.APP_BASE_URL;

  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  const origin = getHeaderValue(req, "origin");

  if (origin) {
    return origin;
  }

  const host =
    getHeaderValue(req, "x-forwarded-host") ?? getHeaderValue(req, "host");
  const proto = getHeaderValue(req, "x-forwarded-proto") ?? "https";

  return host ? `${proto}://${host}` : "http://localhost:3000";
}

function parseRequestBody(req: VercelRequest): CheckoutRequestBody {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as CheckoutRequestBody;
    } catch (error) {
      throw new Error("Invalid JSON payload provided to checkout endpoint.");
    }
  }

  return req.body as CheckoutRequestBody;
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

  let body: CheckoutRequestBody;

  try {
    body = parseRequestBody(req);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid payload";
    res.status(400).json({ error: message });
    return;
  }

  const plan = typeof body.plan === "string" ? body.plan.toLowerCase() : undefined;

  if (!plan || !["starter", "essential", "pro"].includes(plan)) {
    res.status(400).json({ error: "Unsupported plan selected." });
    return;
  }

  const priceId = planPriceMap[plan as PlanKey];

  if (!priceId) {
    res.status(500).json({ error: `Stripe price ID is not configured for ${plan}.` });
    return;
  }

  const baseUrl = resolveBaseUrl(req);
  const successUrl =
    process.env.CHECKOUT_SUCCESS_URL ??
    `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl =
    process.env.CHECKOUT_CANCEL_URL ?? `${baseUrl}/checkout/cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        plan,
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    res.status(500).json({ error: message });
  }
}
