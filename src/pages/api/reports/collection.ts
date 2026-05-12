import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Receipt, Booking, Applicant, Project, Unit } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';
import { Op } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { projectId, fromDate, toDate, paymentMode } = req.query;
    const where: any = { isCancelled: false };
    if (projectId) where.projectId = Number(projectId);
    if (fromDate && toDate) where.receiptDate = { [Op.between]: [fromDate, toDate] };
    else if (fromDate) where.receiptDate = { [Op.gte]: fromDate };
    else if (toDate) where.receiptDate = { [Op.lte]: toDate };
    if (paymentMode) where.paymentMode = paymentMode;

    const receipts = await Receipt.findAll({
      where,
      include: [
        { model: Project },
        { model: Booking, include: [
          { model: Applicant, where: { applicantType: 'primary' }, required: false },
          { model: Unit },
        ]},
      ],
      order: [['receipt_date', 'DESC']],
    });

    return ok(res, receipts);
  } catch (err) { return serverError(res, err); }
}
