import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PaymentPlan, PaymentStage, Installment } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  name: z.string().min(1, 'Plan name required'),
  planType: z.enum(['flexi', 'regular', 'construction']).default('regular'),
  discountType: z.enum(['percent', 'per_area']).default('percent'),
  discountValue: z.number().min(0).default(0),
  is100Percent: z.boolean().default(false),
  description: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const where = projectId ? { projectId: Number(projectId) } : {};
      const plans = await PaymentPlan.findAll({
        where,
        include: [{ model: PaymentStage }, { model: Installment }],
        order: [['name', 'ASC']],
      });
      return ok(res, plans);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const plan = await PaymentPlan.create(parsed.data as any);
      return created(res, plan);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await PaymentPlan.update(parsed.data as any, { where: { id } });
      return ok(res, await PaymentPlan.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
