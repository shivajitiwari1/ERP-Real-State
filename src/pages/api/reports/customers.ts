import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, Applicant, ApplicantAddress, Project, Unit, PaymentPlan, Receipt, Demand } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';
import { Op } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { projectId, search, type } = req.query;
    const where: any = {};
    if (projectId) where.projectId = Number(projectId);

    const applicantWhere: any = { applicantType: 'primary' };
    if (search) {
      applicantWhere[Op.or as any] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { panNo: { [Op.like]: `%${search}%` } },
        { email1: { [Op.like]: `%${search}%` } },
      ];
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Project },
        { model: Unit },
        { model: PaymentPlan },
        { model: Applicant, where: applicantWhere, required: !!search, include: [{ model: ApplicantAddress }] },
        ...(type === 'ledger' ? [{ model: Receipt, required: false }, { model: Demand, required: false }] : []),
      ],
      order: [['booking_date', 'DESC']],
      limit: 500,
    });

    return ok(res, bookings);
  } catch (err) { return serverError(res, err); }
}
