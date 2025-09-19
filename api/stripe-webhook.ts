import crypto from 'node:crypto'

import { getErrorMessage } from './_utils/errors'

export const dynamic = 'force-dynamic'

interface StripeEvent {
  id: string
  type: string
  data: { object: Record<string, unknown> }
}

const SIGNATURE_TOLERANCE_SECONDS = 300

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable')
  }
  return secret
}

function parseStripeSignatureHeader(signature: string) {
  return signature.split(',').reduce<Record<string, string[]>>((acc, item) => {
    const [key, value] = item.split('=')
    if (!key || !value) {
      return acc
    }
    acc[key] = acc[key] ?? []
    acc[key]!.push(value)
    return acc
  }, {})
}

function timingSafeEqual(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected, 'hex')
  const actualBuffer = Buffer.from(actual, 'hex')

  if (expectedBuffer.length !== actualBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer)
}

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parsed = parseStripeSignatureHeader(signatureHeader)
  const timestamp = parsed['t']?.[0]
  const signatures = parsed['v1'] ?? []

  if (!timestamp || signatures.length === 0) {
    throw new Error('Invalid stripe-signature header')
  }

  const signedPayload = `${timestamp}.${payload}`
  const expectedSignature = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex')

  const isValidSignature = signatures.some((signature) => timingSafeEqual(expectedSignature, signature))

  if (!isValidSignature) {
    throw new Error('Invalid webhook signature')
  }

  const timestampNumber = Number(timestamp)
  if (Number.isNaN(timestampNumber)) {
    throw new Error('Invalid timestamp in stripe-signature header')
  }

  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (Math.abs(currentTimestamp - timestampNumber) > SIGNATURE_TOLERANCE_SECONDS) {
    throw new Error('Webhook timestamp outside of tolerance window')
  }

  return JSON.parse(payload) as StripeEvent
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const body = await request.text()

  try {
    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }

    const event = verifyStripeSignature(body, signature, getWebhookSecret())

    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: persist customer/subscription data to the integrations table (brand_id)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // TODO: sync subscription status with the database
        break
      default:
        console.log('Unhandled event', event.type)
    }

    return new Response('ok')
  } catch (error: unknown) {
    return new Response(`Webhook Error: ${getErrorMessage(error)}`, { status: 400 })
  }
}
