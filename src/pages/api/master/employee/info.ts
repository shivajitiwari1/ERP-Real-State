import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Employee, Department } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1, 'Code required'),
  salutation: z.string().min(1, 'Salutation required'),
  firstName: z.string().min(1, 'First name required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name required'),
  departmentId: z.coerce.number().int().positive('Department required'),
  designation: z.string().optional(),
  mobile: z.string().min(10, 'Valid mobile required'),
  email: z.string().email('Valid email required'),
  isAdmin: z.coerce.boolean().default(false),
  isTransfer: z.coerce.boolean().default(false),
  roleType: z.enum(['employee', 'call_center']).default('employee'),
  managerId: z.coerce.number().optional().nullable(),
  joiningDate: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const employees = await Employee.findAll({
        include: [{ model: Department }],
        order: [['first_name', 'ASC']],
      });
      return ok(res, employees);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      const emp = await Employee.create(parsed.data as any);
      return created(res, emp);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      await Employee.update(parsed.data as any, { where: { id } });
      return ok(res, await Employee.findByPk(id, { include: [{ model: Department }] }));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
