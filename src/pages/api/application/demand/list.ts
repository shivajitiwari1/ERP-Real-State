import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Demand, Booking, Applicant, Project, Installment, PaymentStage } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { projectId, bookingId, status } = req.query;
    const where: any = {};
    if (projectId) where.projectId = Number(projectId);
    if (bookingId) where.bookingId = Number(bookingId);
    if (status) where.status = status;
    const demands = await Demand.findAll({
      where,
      include: [
        { model: Booking, include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }] },
        { model: Project },
        { model: Installment },
        { model: PaymentStage },
      ],
      order: [['demand_date', 'DESC']],
      limit: 500,
    });
    return ok(res, demands);
  } catch (err) { return serverError(res, err); }
}
