import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Surrender, Booking, Unit, Applicant, Project } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  bookingId: z.number().int().positive('Select booking'),
  surrenderDate: z.string().min(1, 'Date required'),
  reason: z.string().optional(),
  status: z.enum(['surrendered', 'restored']).default('surrendered'),
  restoredDate: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const surrenders = await Surrender.findAll({
        include: [{
          model: Booking,
          where: projectId ? { projectId: Number(projectId) } : {},
          include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }, { model: Project }, { model: Unit }],
        }],
        order: [['surrender_date', 'DESC']],
      });
      return ok(res, surrenders);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const surrender = await Surrender.create({ ...parsed.data as any, createdBy: (session.user as any).employeeId });
      const booking = await Booking.findByPk(parsed.data.bookingId);
      if (booking) {
        await Booking.update({ status: 'surrendered' }, { where: { id: booking.id } });
        await Unit.update({ status: 'available' }, { where: { id: booking.unitId } });
      }
      return created(res, surrender, 'Surrender application submitted');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
