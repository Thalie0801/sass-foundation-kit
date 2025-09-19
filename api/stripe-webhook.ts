import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error'
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')
  const body = await request.text()
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20'
    })
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: persister customer/subscription → table integrations (brand_id)
        // const session = event.data.object as Stripe.Checkout.Session
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // TODO: sync statut abonnement → DB
        break
      default:
        console.log('Unhandled event', event.type)
    }
    return new Response('ok')
  } catch (error: unknown) {
    return new Response(`Webhook Error: ${getErrorMessage(error)}` , { status: 400 })
  }
}
