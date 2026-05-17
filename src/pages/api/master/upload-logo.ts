import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import multer from 'multer';
import path from 'path';
import { unauthorized, serverError, badRequest } from '@/lib/api-response';

export const config = { api: { bodyParser: false } };

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public/uploads/logos'),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const allowedMimes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext) && allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'POST') return res.status(405).end();
  try {
    await runMiddleware(req, res, upload.single('file'));
    const file = (req as any).file;
    if (!file) return badRequest(res, 'No file uploaded or invalid file type');
    const filePath = `/uploads/logos/${file.filename}`;
    return res.status(200).json({ success: true, data: { path: filePath } });
  } catch (err) {
    return serverError(res, err);
  }
}
