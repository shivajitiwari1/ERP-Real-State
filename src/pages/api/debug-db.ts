import type { NextApiRequest, NextApiResponse } from 'next';
import sequelize from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', host: process.env.DB_HOST, db: process.env.DB_NAME });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: e.message, stack: e.stack?.split('\n').slice(0,5) });
  }
}
