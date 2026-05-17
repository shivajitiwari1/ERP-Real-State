import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Company } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1, 'Code required').max(20),
  groupName: z.string().min(1, 'Group name required'),
  name: z.string().min(1, 'Company name required'),
  address1: z.string().min(1, 'Address required'),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  country: z.string().min(1, 'Country required'),
  pin: z.string().min(1, 'PIN required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  website: z.string().optional(),
  cin: z.string().optional(),
  serviceTaxNo: z.string().optional(),
  panNo: z.string().optional(),
  vatRegNo: z.string().optional(),
  payableAt: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const companies = await Company.findAll({ order: [['name', 'ASC']] });
      return ok(res, companies);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const company = await Company.create(parsed.data as any);
      return created(res, company, 'Company created successfully');
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Company.update(parsed.data as any, { where: { id } });
      return ok(res, await Company.findByPk(id), 'Updated successfully');
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const company = await Company.findByPk(id);
      if (!company) return badRequest(res, 'Company not found');
      try {
        await Company.destroy({ where: { id } });
        return ok(res, null, 'Company deleted successfully');
      } catch (destroyErr: any) {
        if (destroyErr?.original?.code === 'ER_ROW_IS_REFERENCED_2') {
          return badRequest(res, 'Cannot delete: company has linked records (projects, etc.)');
        }
        throw destroyErr;
      }
    }
    res.status(405).end();
  } catch (err) {
    return serverError(res, err);
  }
}
