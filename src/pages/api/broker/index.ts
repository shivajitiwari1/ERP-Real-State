import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Broker } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1, 'Code required'),
  companyName: z.string().optional(),
  firstName: z.string().min(1, 'First name required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name required'),
  designation: z.string().optional(),
  dob: z.string().optional(),
  panNo: z.string().optional(),
  tanNo: z.string().optional(),
  serviceTaxNo: z.string().optional(),
  isGstRegistered: z.boolean().default(false),
  isTdsApplicable: z.boolean().default(false),
  depositMoney: z.number().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
  accountNo: z.string().optional(),
  ifsc: z.string().optional(),
  remark: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const brokers = await Broker.findAll({ order: [['first_name', 'ASC']] });
      return ok(res, brokers);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      const broker = await Broker.create(parsed.data as any);
      return created(res, broker);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
      await Broker.update(parsed.data as any, { where: { id } });
      return ok(res, await Broker.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
