import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // lightweight DB check
    const userCount = await prisma.user.count()
    res.status(200).json({ ok: true, userCount })
  } catch (err: any) {
    console.error('health check error:', err)
    res.status(500).json({ ok: false, error: err.message ?? String(err) })
  }
}