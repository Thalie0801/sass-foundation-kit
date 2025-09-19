export async function POST(request: Request) {
  const payload = await request.json()
  const {
    path = '/webhook/aeditus/health',
    token = process.env.N8N_TOKEN
  } = payload ?? {}

  if (!process.env.N8N_BASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing N8N_BASE_URL environment variable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = `${process.env.N8N_BASE_URL}${path}`
  const init: RequestInit = {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
  const response = await fetch(url, init)
  const text = await response.text()
  return new Response(text, { status: response.status })
}
