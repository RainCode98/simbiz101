import { NextResponse } from 'next/server'
import { neonFetch } from '../../../lib/neonRest'

export async function GET() {
  try {
    const { data, res } = await neonFetch('/users?select=id&limit=1', {
      headers: { 'Prefer': 'count=exact' }
    })
    const contentRange = res.headers.get('content-range') || res.headers.get('Content-Range') || ''
    const total = contentRange.includes('/') ? Number(contentRange.split('/')[1]) : null
    return NextResponse.json({ ok: true, sample: data, count: Number.isFinite(total) ? total : null })
  } catch (err: any) {
    console.error('health error:', err)
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}