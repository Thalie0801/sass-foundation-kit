import Stripe from 'stripe'

function getSiteUrl(request: Request): string {
  return process.env.SITE_URL ?? new URL(request.url).origin
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

export async function POST(request: Request) {
  try {
    const { customerId, returnPath = '/app/billing' } = await request.json()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20'
    })
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getSiteUrl(request)}${returnPath}`
    })
    return Response.json({ url: portal.url })
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), { status: 400 })
  }
}
