import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Agreement, Booking, Applicant, Project, Unit } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  bookingId: z.number().int().positive('Select booking'),
  agreementDate: z.string().min(1, 'Date required'),
  agreementType: z.enum(['provisional', 'allotment', 'bba', 'tpa']).default('allotment'),
  status: z.enum(['active', 'cancelled']).default('active'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const agreements = await Agreement.findAll({
        include: [{
          model: Booking,
          where: projectId ? { projectId: Number(projectId) } : {},
          include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }, { model: Project }, { model: Unit }],
        }],
        order: [['agreement_date', 'DESC']],
        limit: 200,
      });
      return ok(res, agreements);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const agreement = await Agreement.create({ ...parsed.data as any, createdBy: (session.user as any).employeeId });
      // Update unit status to sold on allotment
      if (parsed.data.agreementType === 'allotment' || parsed.data.agreementType === 'bba') {
        const booking = await Booking.findByPk(parsed.data.bookingId);
        if (booking) await Unit.update({ status: 'sold' }, { where: { id: booking.unitId } });
      }
      return created(res, agreement);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      await Agreement.update(data, { where: { id } });
      return ok(res, await Agreement.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
