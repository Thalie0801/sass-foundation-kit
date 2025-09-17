import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';

const STRIPE_API_VERSION = '2024-06-20';

export const config = {
  api: {
    bodyParser: false,
  },
};

type StripeWebhookHeader = {
  timestamp: number;
  signatures: string[];
};

type StripeEvent = {
  id: string;
  type: string;
  api_version?: string;
  [key: string]: unknown;
};

function parseStripeSignature(signatureHeader: string): StripeWebhookHeader {
  const parts = signatureHeader.split(',');
  const signature: StripeWebhookHeader = {
    timestamp: 0,
    signatures: [],
  };

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') {
      signature.timestamp = Number(value);
    } else if (key.startsWith('v') && value) {
      signature.signatures.push(value);
    }
  }

  if (!signature.timestamp || signature.signatures.length === 0) {
    throw new Error('Invalid Stripe signature header.');
  }

  return signature;
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    const bufferChunk =
      typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : Buffer.from(chunk);
    chunks.push(bufferChunk);
  }

  return Buffer.concat(chunks);
}

function constructStripeEvent(
  rawBody: Buffer,
  signatureHeader: string,
  secret: string,
): StripeEvent {
  const { timestamp, signatures } = parseStripeSignature(signatureHeader);
  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const match = signatures.some((candidate) => candidate === expectedSignature);

  if (!match) {
    throw new Error('Invalid Stripe signature.');
  }

  const event = JSON.parse(rawBody.toString('utf8')) as StripeEvent;

  if (!event.api_version) {
    event.api_version = STRIPE_API_VERSION;
  }

  return event;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    res.status(500).json({ error: 'Stripe webhook secret is not configured.' });
    return;
  }

  const signatureHeader = req.headers['stripe-signature'];

  if (typeof signatureHeader !== 'string') {
    res.status(400).json({ error: 'Stripe signature header is missing.' });
    return;
  }

  let event: StripeEvent;

  try {
    const rawBody = await readRawBody(req);
    event = constructStripeEvent(rawBody, signatureHeader, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: `Webhook Error: ${message}` });
    return;
  }

  // TODO: Integrate Supabase persistence for the received Stripe event.

  res.status(200).json({ received: true, eventType: event.type });
}
