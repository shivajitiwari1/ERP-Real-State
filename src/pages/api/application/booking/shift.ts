import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UnitShift, Booking, Applicant, Unit } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  fromBookingId: z.number().int().positive('Select booking'),
  toUnitId: z.number().int().positive('Select target unit'),
  shiftDate: z.string().min(1, 'Shift date required'),
  reason: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const shifts = await UnitShift.findAll({
        include: [
          {
            model: Booking,
            where: projectId ? { projectId: Number(projectId) } : {},
            include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }],
          },
          { model: Unit },
        ],
        order: [['shift_date', 'DESC']],
        limit: 200,
      });
      return ok(res, shifts);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const shift = await UnitShift.create({ ...parsed.data, createdBy: (session.user as any).id } as any);
      return created(res, shift);
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
