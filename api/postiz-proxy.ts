export async function POST(request: Request) {
  const payload = await request.json()
  const {
    endpoint = '/api/health',
    apiKey = process.env.POSTIZ_API_KEY
  } = payload ?? {}

  if (!process.env.POSTIZ_BASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing POSTIZ_BASE_URL environment variable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = `${process.env.POSTIZ_BASE_URL}${endpoint}`
  const init: RequestInit = {
    method: 'POST',
    headers: {
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
  const response = await fetch(url, init)
  const text = await response.text()
  return new Response(text, { status: response.status })
}
