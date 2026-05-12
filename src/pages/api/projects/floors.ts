import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Floor, Tower } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  towerId: z.number().int().positive('Select tower'),
  floorNumber: z.number().int(),
  floorName: z.string().min(1, 'Floor name required'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { towerId } = req.query;
      const where = towerId ? { towerId: Number(towerId) } : {};
      const floors = await Floor.findAll({ where, include: [{ model: Tower }], order: [['floor_number', 'ASC']] });
      return ok(res, floors);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const floor = await Floor.create(parsed.data as any);
      return created(res, floor);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Floor.update(parsed.data as any, { where: { id } });
      return ok(res, await Floor.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
