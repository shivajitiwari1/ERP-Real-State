import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Demand, Booking, Applicant, Project, Unit, Installment, PaymentStage, Receipt } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';
import { Op, fn, col, literal } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { projectId, status, fromDate, toDate } = req.query;
    const where: any = {};
    if (projectId) where.projectId = Number(projectId);
    if (status) where.status = status;
    else where.status = { [Op.notIn]: ['settled'] };
    if (fromDate && toDate) where.dueDate = { [Op.between]: [fromDate, toDate] };

    const demands = await Demand.findAll({
      where,
      include: [
        { model: Booking, include: [
          { model: Applicant, where: { applicantType: 'primary' }, required: false },
          { model: Unit },
        ]},
        { model: Project },
        { model: Installment },
        { model: PaymentStage },
      ],
      order: [['due_date', 'ASC']],
    });

    return ok(res, demands);
  } catch (err) { return serverError(res, err); }
}
