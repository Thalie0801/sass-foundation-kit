import Stripe from 'stripe'

function getSiteUrl(request: Request): string {
  return process.env.SITE_URL ?? new URL(request.url).origin
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

export async function POST(request: Request) {
  try {
    const {
      priceId,
      successPath = '/onboarding',
      cancelPath = '/pricing'
    } = await request.json()

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20'
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getSiteUrl(request)}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getSiteUrl(request)}${cancelPath}`,
      allow_promotion_codes: true
    })

    return Response.json({ url: session.url })
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), { status: 400 })
  }
}
