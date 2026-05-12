import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Unit, Tower, Floor, UnitType } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive(),
  towerId: z.number().int().positive('Select tower'),
  floorId: z.number().int().positive('Select floor'),
  unitTypeId: z.number().optional().nullable(),
  unitNumber: z.string().min(1, 'Unit number required'),
  area: z.number().optional().nullable(),
  locationId: z.number().optional().nullable(),
  status: z.enum(['available', 'booked', 'sold', 'cancelled', 'held']).default('available'),
});

const bulkSchema = z.object({
  projectId: z.number().int().positive(),
  towerId: z.number().int().positive(),
  floorId: z.number().int().positive(),
  unitTypeId: z.number().optional().nullable(),
  unitCount: z.number().int().positive(),
  startNumber: z.number().int().default(1),
  prefix: z.string().optional(),
  area: z.number().optional().nullable(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId, towerId, floorId } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      if (towerId) where.towerId = Number(towerId);
      if (floorId) where.floorId = Number(floorId);
      const units = await Unit.findAll({
        where, include: [{ model: Tower }, { model: Floor }, { model: UnitType }],
        order: [['unit_number', 'ASC']],
      });
      return ok(res, units);
    }
    if (req.method === 'POST') {
      // Bulk create support
      if (req.body.unitCount) {
        const parsed = bulkSchema.safeParse(req.body);
        if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
        const { unitCount, startNumber, prefix, ...base } = parsed.data;
        const units = Array.from({ length: unitCount }, (_, i) => ({
          ...base,
          unitNumber: `${prefix || ''}${startNumber + i}`,
          status: 'available' as const,
        }));
        await Unit.bulkCreate(units as any);
        return created(res, null, `${unitCount} units created`);
      }
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const unit = await Unit.create(parsed.data as any);
      return created(res, unit);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await Unit.update(data, { where: { id } });
      return ok(res, await Unit.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
