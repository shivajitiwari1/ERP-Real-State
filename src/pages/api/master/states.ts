import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { State } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const states = await State.findAll({ order: [['name', 'ASC']] });
    return ok(res, states);
  } catch (err) {
    return serverError(res, err);
  }
}
