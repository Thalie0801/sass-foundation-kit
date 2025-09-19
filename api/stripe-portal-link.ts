import { getErrorMessage } from './_utils/errors'

const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1'

interface PortalSessionResponse {
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
      customerId,
      returnPath = '/app/billing'
    } = await request.json()

    if (!customerId || typeof customerId !== 'string') {
      throw new Error('Missing required "customerId" in request body')
    }

    const params = new URLSearchParams()
    params.append('customer', customerId)
    params.append('return_url', `${getSiteUrl(request)}${returnPath}`)

    const response = await fetch(`${STRIPE_API_BASE_URL}/billing_portal/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getStripeSecretKey()}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const portal = (await response.json()) as PortalSessionResponse

    if (!response.ok) {
      throw new Error(portal.error?.message ?? 'Failed to create Stripe billing portal session')
    }

    if (!portal.url) {
      throw new Error('Stripe billing portal session response did not include a URL')
    }

    return Response.json({ url: portal.url })
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
