import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const logoPath = path.join(process.cwd(), 'public', 'ss-erp-logo.png');
  if (!fs.existsSync(logoPath)) {
    res.status(404).end('Logo not found');
    return;
  }
  const img = fs.readFileSync(logoPath);
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.end(img);
}
