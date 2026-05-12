import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, Applicant, ApplicantAddress, Unit, Project, PaymentPlan, Receipt, Demand } from '@/models';
import { ok, unauthorized, serverError, badRequest } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  const { id } = req.query;
  if (!id) return badRequest(res, 'ID required');
  try {
    if (req.method === 'GET') {
      const booking = await Booking.findByPk(Number(id), {
        include: [
          { model: Project },
          { model: Unit },
          { model: PaymentPlan },
          { model: Applicant, include: [{ model: ApplicantAddress }] },
          { model: Receipt, limit: 20, order: [['receipt_date', 'DESC']] },
          { model: Demand, limit: 50, order: [['demand_date', 'DESC']] },
        ],
      });
      if (!booking) return badRequest(res, 'Booking not found');
      return ok(res, booking);
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
