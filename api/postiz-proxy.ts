export async function POST(request: Request) {
  const {
    endpoint = '/api/health',
    apiKey = process.env.POSTIZ_API_KEY,
    payload
  } = await request.json()

  if (!process.env.POSTIZ_BASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing POSTIZ_BASE_URL environment variable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = `${process.env.POSTIZ_BASE_URL}${endpoint}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload ?? {})
  })
  const text = await response.text()
  return new Response(text, { status: response.status })
}
