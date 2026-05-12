import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Receipt, ReceiptHead, Cheque, Booking, Applicant, Project } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  bookingId: z.number().int().positive('Select booking'),
  projectId: z.number().int().positive(),
  receiptNo: z.string().min(1, 'Receipt number required'),
  receiptDate: z.string().min(1, 'Date required'),
  receiptType: z.enum(['installment', 'booking', 'penalty', 'addon']).default('installment'),
  paymentMode: z.enum(['cash', 'cheque', 'online', 'dd', 'neft', 'rtgs']).default('cheque'),
  amount: z.number().positive('Amount required'),
  penaltyAmount: z.number().min(0).default(0),
  instrumentNo: z.string().optional(),
  instrumentDate: z.string().optional(),
  bankId: z.number().optional().nullable(),
  branch: z.string().optional(),
  narration: z.string().optional(),
  heads: z.array(z.object({ headName: z.string(), amount: z.number(), taxAmount: z.number().default(0) })).optional(),
  chequeDetails: z.object({
    chequeNo: z.string(),
    chequeDate: z.string(),
    bankName: z.string(),
    branch: z.string().optional(),
    micr: z.string().optional(),
  }).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { bookingId, projectId } = req.query;
      const where: any = { isCancelled: false };
      if (bookingId) where.bookingId = Number(bookingId);
      if (projectId) where.projectId = Number(projectId);
      const receipts = await Receipt.findAll({
        where,
        include: [
          { model: ReceiptHead },
          { model: Booking, include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }] },
        ],
        order: [['receipt_date', 'DESC']],
        limit: 200,
      });
      return ok(res, receipts);
    }

    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const { heads, chequeDetails, ...data } = parsed.data;
      const createdBy = (session.user as any).employeeId;
      const totalAmount = data.amount + (data.penaltyAmount || 0);

      // Check for duplicate receipt number
      const exists = await Receipt.findOne({ where: { receiptNo: data.receiptNo } });
      if (exists) return badRequest(res, 'Receipt number already exists');

      const receipt = await Receipt.create({ ...data as any, totalAmount, isCancelled: false, isDuplicate: false, createdBy });

      if (heads) {
        for (const h of heads) await ReceiptHead.create({ ...h, receiptId: receipt.id });
      }
      if (chequeDetails && data.paymentMode === 'cheque') {
        await Cheque.create({ ...chequeDetails as any, receiptId: receipt.id, amount: data.amount, status: 'pending' });
      }

      return created(res, receipt, 'Receipt generated successfully');
    }

    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await Receipt.update(data, { where: { id } });
      return ok(res, await Receipt.findByPk(id));
    }

    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
