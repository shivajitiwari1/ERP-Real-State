import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReminderDays } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive(),
  r1Days: z.number().int().min(1),
  r2Days: z.number().int().min(1),
  r3Days: z.number().int().min(1),
  r4Days: z.number().int().min(1),
  terminationDays: z.number().int().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const reminder = await ReminderDays.findOne({ where: { projectId: Number(projectId) } });
      return ok(res, reminder);
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const [reminder] = await ReminderDays.upsert(parsed.data as any);
      return ok(res, reminder, 'Reminder days saved');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
