import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Project, Company, ProjectType } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  companyId: z.number().int().positive('Select company'),
  projectTypeId: z.number().optional().nullable(),
  name: z.string().min(1, 'Project name required'),
  code: z.string().min(1, 'Project code required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pin: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  possessionDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const projects = await Project.findAll({
        include: [{ model: Company }, { model: ProjectType }],
        order: [['name', 'ASC']],
      });
      return ok(res, projects);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const project = await Project.create(parsed.data as any);
      return created(res, project, 'Project created successfully');
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Project.update(parsed.data as any, { where: { id } });
      return ok(res, await Project.findByPk(id, { include: [{ model: Company }] }), 'Updated');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
