export async function POST(request: Request) {
  const {
    endpoint = '/api/health',
    apiKey = process.env.POSTIZ_API_KEY
  } = await request.json()

  if (!process.env.POSTIZ_BASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing POSTIZ_BASE_URL environment variable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const url = `${process.env.POSTIZ_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
  })
  const text = await response.text()
  return new Response(text, { status: response.status })
}
