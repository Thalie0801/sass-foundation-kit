import { getErrorMessage } from './_utils/errors'

const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1'

interface CheckoutSessionResponse {
  url?: string
  error?: { message?: string }
}

function getStripeSecretKey(): string {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }
  return secret
}

function getSiteUrl(request: Request): string {
  return process.env.SITE_URL ?? new URL(request.url).origin
}

export async function POST(request: Request) {
  try {
    const {
      priceId,
      successPath = '/onboarding',
      cancelPath = '/pricing'
    } = await request.json()

    if (!priceId || typeof priceId !== 'string') {
      throw new Error('Missing required "priceId" in request body')
    }

    const params = new URLSearchParams()
    params.append('mode', 'subscription')
    params.append('line_items[0][price]', priceId)
    params.append('line_items[0][quantity]', '1')
    params.append('allow_promotion_codes', 'true')

    const siteUrl = getSiteUrl(request)
    params.append('success_url', `${siteUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`)
    params.append('cancel_url', `${siteUrl}${cancelPath}`)

    const secretKey = getStripeSecretKey()

    const response = await fetch(`${STRIPE_API_BASE_URL}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const session = (await response.json()) as CheckoutSessionResponse

    if (!response.ok) {
      throw new Error(session.error?.message ?? 'Failed to create Stripe checkout session')
    }

    if (!session.url) {
      throw new Error('Stripe checkout session response did not include a URL')
    }

    return Response.json({ url: session.url })
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
