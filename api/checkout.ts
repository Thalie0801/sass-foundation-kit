import type { VercelRequest, VercelResponse } from '@vercel/node';

const STRIPE_API_VERSION = '2024-06-20';

async function readRequestBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }

  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    const bufferChunk =
      typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : Buffer.from(chunk);
    chunks.push(bufferChunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON payload';
    throw new Error(`Unable to parse request body: ${message}`);
  }
}

function resolvePriceId(plan: string | undefined): string | null {
  if (!plan) {
    return null;
  }

  const envKey = `STRIPE_PRICE_${plan.toUpperCase()}`;
  const priceId = process.env[envKey];

  return priceId ?? null;
}

function resolveUrl(fallback: string, envKey: string, req: VercelRequest): string {
  const configuredUrl = process.env[envKey];

  if (configuredUrl) {
    return configuredUrl;
  }

  const origin = req.headers.origin ?? '';
  return origin ? `${origin}${fallback}` : fallback;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    res.status(500).json({ error: 'Stripe secret key is not configured.' });
    return;
  }

  let payload: Record<string, unknown>;

  try {
    payload = await readRequestBody(req);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
    return;
  }

  const plan = typeof payload.plan === 'string' ? payload.plan : undefined;
  const email = typeof payload.email === 'string' ? payload.email : undefined;

  if (!plan || !email) {
    res.status(400).json({ error: 'Both "plan" and "email" fields are required.' });
    return;
  }

  const priceId = resolvePriceId(plan);

  if (!priceId) {
    res.status(400).json({ error: `Unknown plan provided: ${plan}` });
    return;
  }

  const params = new URLSearchParams({
    success_url: resolveUrl('/success', 'STRIPE_SUCCESS_URL', req),
    cancel_url: resolveUrl('/cancel', 'STRIPE_CANCEL_URL', req),
    mode: 'subscription',
    customer_email: email,
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
  });

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': STRIPE_API_VERSION,
      },
      body: params,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      res.status(response.status).json({ error: errorBody });
      return;
    }

    const session = (await response.json()) as { id?: string; url?: string };

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Stripe session';
    res.status(500).json({ error: message });
  }
}
