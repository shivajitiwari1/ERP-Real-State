import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PaymentStage } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive(),
  planId: z.number().int().positive('Select payment plan'),
  name: z.string().min(1, 'Stage name required'),
  stageOrder: z.number().int().min(0).default(0),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { planId } = req.query;
      const where = planId ? { planId: Number(planId) } : {};
      const stages = await PaymentStage.findAll({ where, order: [['stage_order', 'ASC']] });
      return ok(res, stages);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const stage = await PaymentStage.create(parsed.data as any);
      return created(res, stage);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await PaymentStage.update(parsed.data as any, { where: { id } });
      return ok(res, await PaymentStage.findByPk(id));
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await PaymentStage.destroy({ where: { id } });
      return ok(res, null, 'Deleted');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
