import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PossessionDate, Booking, Applicant, Project, Unit, NocRequest } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  bookingId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  towerId: z.number().optional().nullable(),
  unitId: z.number().optional().nullable(),
  expectedDate: z.string().optional(),
  actualDate: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      const dates = await PossessionDate.findAll({
        where,
        include: [{ model: Booking, include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }, { model: Unit }] }],
        order: [['expected_date', 'ASC']],
      });
      return ok(res, dates);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const record = await PossessionDate.upsert(parsed.data as any);
      return created(res, record);
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
