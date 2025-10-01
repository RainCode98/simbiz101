import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({ take: 5 }) // lightweight check
    const count = await prisma.user.count()
    res.status(200).json({ ok: true, count, sample: users })
  } catch (err: any) {
    console.error('DB test error:', err)
    res.status(500).json({ ok: false, error: err.message ?? String(err) })
  }
}