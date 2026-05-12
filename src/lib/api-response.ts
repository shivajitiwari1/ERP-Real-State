import { NextApiResponse } from 'next';

export function ok(res: NextApiResponse, data: unknown, message = 'Success') {
  return res.status(200).json({ success: true, data, message });
}

export function created(res: NextApiResponse, data: unknown, message = 'Created') {
  return res.status(201).json({ success: true, data, message });
}

export function badRequest(res: NextApiResponse, message: string) {
  return res.status(400).json({ success: false, data: null, message });
}

export function unauthorized(res: NextApiResponse) {
  return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
}

export function forbidden(res: NextApiResponse) {
  return res.status(403).json({ success: false, data: null, message: 'Forbidden' });
}

export function serverError(res: NextApiResponse, error: unknown) {
  console.error(error);
  return res.status(500).json({ success: false, data: null, message: 'Server error' });
}
