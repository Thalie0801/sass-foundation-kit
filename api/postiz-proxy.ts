export async function POST(request: Request) {
  const { endpoint = '/api/health', apiKey = process.env.POSTIZ_API_KEY } = await request.json()
  const url = `${process.env.POSTIZ_BASE_URL}${endpoint}`
  const res = await fetch(url, { headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined })
  const text = await res.text()
  return new Response(text, { status: res.status })
}
