import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Cheque, Receipt, Booking, Applicant } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const updateSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['pending', 'deposited', 'cleared', 'bounced', 'represented']),
  depositDate: z.string().optional(),
  clearDate: z.string().optional(),
  bounceDate: z.string().optional(),
  remarks: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { status, projectId } = req.query;
      const where: any = {};
      if (status) where.status = status;
      const cheques = await Cheque.findAll({
        where,
        include: [{
          model: Receipt,
          where: projectId ? { projectId: Number(projectId) } : {},
          include: [{ model: Booking, include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }] }],
        }],
        order: [['cheque_date', 'DESC']],
        limit: 500,
      });
      return ok(res, cheques);
    }
    if (req.method === 'PUT') {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const { id, ...data } = parsed.data;
      await Cheque.update(data as any, { where: { id } });
      return ok(res, await Cheque.findByPk(id), 'Cheque status updated');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
