import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = process.env.DB_HOST ?? 'NOT SET';
  const port = process.env.DB_PORT ?? 'NOT SET';
  const db   = process.env.DB_NAME  ?? 'NOT SET';

  // Test DB connection without importing models
  try {
    const { Sequelize } = await import('sequelize');
    const seq = new Sequelize(db, process.env.DB_USER ?? '', process.env.DB_PASS ?? '', {
      host,
      port: Number(port),
      dialect: 'mysql',
      logging: false,
      dialectOptions: host === 'localhost' ? {} : { ssl: { rejectUnauthorized: false } },
    });
    await seq.authenticate();
    await seq.close();
    res.json({ status: 'DB_OK', host, port, db });
  } catch (e: any) {
    res.status(500).json({ status: 'DB_ERROR', host, port, db, error: e.message });
  }
}
