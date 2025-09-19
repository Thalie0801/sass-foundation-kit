export async function POST(request: Request) {
  const {
    path = '/webhook/aeditus/health',
    token = process.env.N8N_TOKEN,
    payload
  } = await request.json()

  if (!process.env.N8N_BASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing N8N_BASE_URL environment variable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = `${process.env.N8N_BASE_URL}${path}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload ?? {})
  })
  const text = await response.text()
  return new Response(text, { status: response.status })
}
