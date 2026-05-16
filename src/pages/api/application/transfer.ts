import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Transfer, Booking, Applicant } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  fromBookingId: z.number().int().positive('Select source booking'),
  transferDate: z.string().min(1, 'Transfer date required'),
  transferFee: z.number().min(0).default(0),
  serviceTax: z.number().min(0).default(0),
  status: z.enum(['pending', 'completed']).default('pending'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId, status } = req.query;
      const where: any = {};
      if (status) where.status = status;
      const transfers = await Transfer.findAll({
        where,
        include: [
          {
            model: Booking,
            as: 'fromBooking',
            where: projectId ? { projectId: Number(projectId) } : {},
            include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }],
          },
        ],
        order: [['transfer_date', 'DESC']],
        limit: 200,
      });
      return ok(res, transfers);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const transfer = await Transfer.create({ ...parsed.data, createdBy: (session.user as any).id } as any);
      return created(res, transfer);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await Transfer.update(data, { where: { id } });
      return ok(res, await Transfer.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
