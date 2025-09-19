export async function POST(request: Request) {
  const { path = '/webhook/aeditus/health', token = process.env.N8N_TOKEN } = await request.json()
  const url = `${process.env.N8N_BASE_URL}${path}`
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
  const text = await res.text()
  return new Response(text, { status: res.status })
}
