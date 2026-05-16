import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BookingAmount, PaymentPlan } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  planId: z.number().int().positive('Select payment plan'),
  amount: z.number().positive('Amount must be positive'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId, planId } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      if (planId) where.planId = Number(planId);
      const amounts = await BookingAmount.findAll({ where, include: [{ model: PaymentPlan }] });
      return ok(res, amounts);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const ba = await BookingAmount.create(parsed.data as any);
      return created(res, ba);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await BookingAmount.update(data, { where: { id } });
      return ok(res, await BookingAmount.findByPk(id));
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await BookingAmount.destroy({ where: { id } });
      return ok(res, null, 'Deleted');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
