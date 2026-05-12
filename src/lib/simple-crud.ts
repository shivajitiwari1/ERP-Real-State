import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { ok, created, badRequest, unauthorized, serverError } from './api-response';
import { ModelStatic, Model } from 'sequelize';
import { z } from 'zod';

export function simpleCrudHandler(ModelClass: ModelStatic<Model>, schema: z.ZodObject<any>) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return unauthorized(res);
    try {
      if (req.method === 'GET') {
        const records = await ModelClass.findAll({ order: [['name', 'ASC']] });
        return ok(res, records);
      }
      if (req.method === 'POST') {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
        const record = await ModelClass.create(parsed.data as any);
        return created(res, record);
      }
      if (req.method === 'PUT') {
        const { id, ...data } = req.body;
        if (!id) return badRequest(res, 'ID required');
        const parsed = schema.safeParse(data);
        if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');
        await ModelClass.update(parsed.data as any, { where: { id } });
        return ok(res, await ModelClass.findByPk(id));
      }
      if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return badRequest(res, 'ID required');
        await ModelClass.destroy({ where: { id } });
        return ok(res, null, 'Deleted successfully');
      }
      res.status(405).json({ message: 'Method not allowed' });
    } catch (err) {
      return serverError(res, err);
    }
  };
}
