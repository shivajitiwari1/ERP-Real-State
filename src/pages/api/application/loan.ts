import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LoanDetail, Booking, Applicant, BankLoan } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  bookingId: z.number().int().positive('Select booking'),
  bankId: z.number().optional().nullable(),
  branch: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNo: z.string().optional(),
  fileNo: z.string().optional(),
  fileDate: z.string().optional(),
  sanctionedAmount: z.number().optional().nullable(),
  bankInfo: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId, bookingId } = req.query;
      if (bookingId) {
        const loan = await LoanDetail.findOne({ where: { bookingId: Number(bookingId) }, include: [{ model: BankLoan }] });
        return ok(res, loan);
      }
      const loans = await LoanDetail.findAll({
        include: [
          { model: BankLoan },
          { model: Booking, where: projectId ? { projectId: Number(projectId) } : {}, include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }] },
        ],
        order: [['created_at', 'DESC']],
        limit: 200,
      });
      return ok(res, loans);
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const [loan] = await LoanDetail.upsert(parsed.data as any);
      return ok(res, loan, 'Loan details saved');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
