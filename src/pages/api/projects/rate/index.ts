import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Rate, UnitType } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  unitTypeId: z.number().optional().nullable(),
  ratePerSqft: z.number().positive('Rate must be positive'),
  effectiveDate: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const where = projectId ? { projectId: Number(projectId) } : {};
      const rates = await Rate.findAll({ where, include: [{ model: UnitType }], order: [['created_at', 'DESC']] });
      return ok(res, rates);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const rate = await Rate.create(parsed.data as any);
      return created(res, rate);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Rate.update(parsed.data as any, { where: { id } });
      return ok(res, await Rate.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
