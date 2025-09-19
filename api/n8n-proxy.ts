export async function POST(request: Request) {
  const {
    path = '/webhook/aeditus/health',
    token = process.env.N8N_TOKEN
  } = await request.json()

  if (!process.env.N8N_BASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing N8N_BASE_URL environment variable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = `${process.env.N8N_BASE_URL}${path}`
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
  const text = await response.text()
  return new Response(text, { status: response.status })
}
