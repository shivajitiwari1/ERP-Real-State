import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, Project, Unit, Tower, UnitType, Applicant } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';
import { Op } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { projectId, fromDate, toDate } = req.query;
    const where: any = { status: { [Op.in]: ['active', 'transferred', 'sold'] } };
    if (projectId) where.projectId = Number(projectId);
    if (fromDate && toDate) where.bookingDate = { [Op.between]: [fromDate, toDate] };
    else if (fromDate) where.bookingDate = { [Op.gte]: fromDate };

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Project },
        { model: Unit, include: [{ model: Tower }, { model: UnitType }] },
        { model: Applicant, where: { applicantType: 'primary' }, required: false },
      ],
      order: [['booking_date', 'DESC']],
    });

    return ok(res, bookings);
  } catch (err) { return serverError(res, err); }
}
