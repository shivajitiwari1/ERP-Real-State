import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Tower, Project } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  name: z.string().min(1, 'Tower name required'),
  code: z.string().min(1, 'Tower code required'),
  totalFloors: z.number().int().min(0).default(0),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const where = projectId ? { projectId: Number(projectId) } : {};
      const towers = await Tower.findAll({ where, include: [{ model: Project }], order: [['name', 'ASC']] });
      return ok(res, towers);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const tower = await Tower.create(parsed.data as any);
      return created(res, tower);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Tower.update(parsed.data as any, { where: { id } });
      return ok(res, await Tower.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
