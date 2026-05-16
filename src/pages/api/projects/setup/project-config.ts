import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProjectConfiguration } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  projectId: z.number().int().positive('Select project'),
  bookingAuthType: z.enum(['auto', 'manual']).default('auto'),
  receiptNoPrefix: z.string().min(1).default('REC'),
  registrationNoPrefix: z.string().min(1).default('REG'),
  transferAuthType: z.enum(['auto', 'manual']).default('auto'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId } = req.query;
      const config = await ProjectConfiguration.findOne({ where: { projectId: Number(projectId) } });
      return ok(res, config);
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const [config] = await ProjectConfiguration.upsert(parsed.data as any);
      return ok(res, config, 'Configuration saved');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
