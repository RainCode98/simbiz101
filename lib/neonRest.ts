export async function neonFetch(path: string, opts: {
  method?: string
  headers?: Record<string,string>
  body?: any
} = {}) {
  const base = process.env.NEON_REST_URL
  const key = process.env.NEON_REST_KEY
  if (!base || !key) throw new Error('Missing NEON_REST_URL or NEON_REST_KEY env var')

  const url = base.replace(/\/$/, '') + path
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    ...opts.headers,
  }

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })

  const text = await res.text()
  let data: any = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!res.ok) {
    const msg = typeof data === 'string' ? data : (data?.message ?? JSON.stringify(data))
    throw new Error(`Neon REST ${res.status}: ${msg}`)
  }

  return { data, res }
}