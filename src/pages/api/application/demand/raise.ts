import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, Demand, Installment, PaymentStage, Unit, Tower, Applicant } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  demandType: z.enum(['stage', 'tower', 'customer', 'installment']),
  demandDate: z.string().min(1, 'Demand date required'),
  dueDate: z.string().optional(),
  stageId: z.number().optional().nullable(),
  towerId: z.number().optional().nullable(),
  bookingId: z.number().optional().nullable(),
  installmentId: z.number().optional().nullable(),
  taxPercent: z.number().min(0).default(0),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);

  if (req.method !== 'POST') return res.status(405).end();

  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');

    const { projectId, demandType, demandDate, dueDate, stageId, towerId, bookingId, installmentId, taxPercent } = parsed.data;

    // Get bookings to raise demand for
    let bookingWhere: any = { projectId, status: 'active' };
    if (bookingId) bookingWhere.id = bookingId;

    const bookings = await Booking.findAll({
      where: bookingWhere,
      include: towerId ? [{ model: Unit, where: { towerId } }] : [],
    });

    if (bookings.length === 0) return badRequest(res, 'No active bookings found');

    // Get installment amount
    let installmentAmount = 0;
    let installment = null;
    if (installmentId) {
      installment = await Installment.findByPk(installmentId);
      if (installment) installmentAmount = Number(installment.amount);
    } else if (stageId) {
      const stageInstallments = await Installment.findAll({ where: { stageId } });
      installmentAmount = stageInstallments.reduce((sum, i) => sum + Number(i.amount), 0);
    }

    const created: number[] = [];
    for (const booking of bookings) {
      // Check if demand already exists for this booking + installment
      const existing = await Demand.findOne({
        where: {
          bookingId: booking.id,
          ...(installmentId ? { installmentId } : {}),
          ...(stageId ? { stageId } : {}),
        },
      });
      if (existing) continue;

      const amount = installmentAmount > 0 ? installmentAmount : Number(booking.basicPrice) * 0.1;
      const taxAmount = (amount * taxPercent) / 100;

      await Demand.create({
        bookingId: booking.id,
        projectId,
        installmentId: installmentId || undefined,
        stageId: stageId || undefined,
        demandDate: demandDate as any,
        dueDate: dueDate as any,
        amount,
        taxAmount,
        totalAmount: amount + taxAmount,
        demandType,
        status: 'pending',
      });
      created.push(booking.id);
    }

    return ok(res, { raised: created.length, skipped: bookings.length - created.length },
      `Demand raised for ${created.length} bookings`);
  } catch (err) { return serverError(res, err); }
}
