import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Unit, Tower, Floor, UnitType, Project, Booking, Applicant } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { projectId, towerId, status, type } = req.query;
    const where: any = {};
    if (projectId) where.projectId = Number(projectId);
    if (towerId) where.towerId = Number(towerId);
    if (status) where.status = status;

    const units = await Unit.findAll({
      where,
      include: [
        { model: Tower },
        { model: Floor },
        { model: UnitType },
        { model: Project },
        { model: Booking, required: false, where: { status: 'active' }, include: [{ model: Applicant, where: { applicantType: 'primary' }, required: false }] },
      ],
      order: [['tower_id', 'ASC'], ['floor_id', 'ASC'], ['unit_number', 'ASC']],
    });

    // Summary by status
    if (type === 'summary') {
      const summary = { available: 0, booked: 0, sold: 0, cancelled: 0, held: 0, total: units.length };
      units.forEach(u => { summary[u.status as keyof typeof summary] = (summary[u.status as keyof typeof summary] as number || 0) + 1; });
      return ok(res, summary);
    }

    return ok(res, units);
  } catch (err) { return serverError(res, err); }
}
