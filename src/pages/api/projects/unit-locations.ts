import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UnitLocation } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  name: z.string().min(1, 'Location name required'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      const records = await UnitLocation.findAll({ where, order: [['name', 'ASC']] });
      return ok(res, records);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const record = await UnitLocation.create(parsed.data as any);
      return created(res, record);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await UnitLocation.update(parsed.data as any, { where: { id } });
      return ok(res, await UnitLocation.findByPk(id));
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await UnitLocation.destroy({ where: { id } });
      return ok(res, null, 'Deleted successfully');
    }
    res.status(405).end();
  } catch (err) {
    return serverError(res, err);
  }
}
