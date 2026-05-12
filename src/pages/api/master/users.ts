import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User, Employee, Role } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const createSchema = z.object({
  employeeId: z.coerce.number().int().positive('Employee required'),
  username: z.string().min(3, 'Min 3 characters'),
  password: z.string().min(6, 'Min 6 characters'),
  roleId: z.coerce.number().int().positive('Role required'),
  isActive: z.coerce.boolean().default(true),
});

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  employeeId: z.coerce.number().int().positive(),
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  roleId: z.coerce.number().int().positive(),
  isActive: z.coerce.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const users = await User.findAll({
        include: [{ model: Employee }, { model: Role }],
        order: [['username', 'ASC']],
      });
      const safe = users.map(u => ({ ...u.toJSON(), passwordHash: undefined }));
      return ok(res, safe);
    }
    if (req.method === 'POST') {
      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const existing = await User.findOne({ where: { username: parsed.data.username } });
      if (existing) return badRequest(res, 'Username already exists');
      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      const user = await User.create({ ...parsed.data, passwordHash });
      return created(res, { ...user.toJSON(), passwordHash: undefined });
    }
    if (req.method === 'PUT') {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const { id, password, ...data } = parsed.data;
      const updateData: any = data;
      if (password) updateData.passwordHash = await bcrypt.hash(password, 12);
      await User.update(updateData, { where: { id } });
      return ok(res, null, 'User updated');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
