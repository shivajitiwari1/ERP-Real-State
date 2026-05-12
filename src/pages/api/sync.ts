import type { NextApiRequest, NextApiResponse } from 'next';
import { syncDatabase } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') return res.status(404).end();
  try {
    await syncDatabase();
    res.json({ success: true, message: 'Database synced' });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
}
