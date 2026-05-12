import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Installment, PaymentStage } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  planId: z.number().int().positive('Select plan'),
  stageId: z.number().optional().nullable(),
  name: z.string().min(1, 'Installment name required'),
  dueType: z.enum(['date', 'milestone', 'on_booking']).default('date'),
  dueDate: z.string().optional(),
  percentage: z.number().min(0).max(100).default(0),
  amount: z.number().min(0).default(0),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { planId } = req.query;
      const where = planId ? { planId: Number(planId) } : {};
      const items = await Installment.findAll({
        where, include: [{ model: PaymentStage }], order: [['id', 'ASC']],
      });
      return ok(res, items);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const inst = await Installment.create(parsed.data as any);
      return created(res, inst);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Installment.update(parsed.data as any, { where: { id } });
      return ok(res, await Installment.findByPk(id));
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await Installment.destroy({ where: { id } });
      return ok(res, null, 'Deleted');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
