import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BrokerProjectMapping, Broker, Project } from "@/models";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { z } from "zod";
const schema = z.object({ brokerId: z.number().int().positive(), projectId: z.number().int().positive(), commissionRate: z.number().min(0).default(0) });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") {
      const { brokerId } = req.query;
      const where: any = brokerId ? { brokerId: Number(brokerId) } : {};
      const mappings = await BrokerProjectMapping.findAll({ where, include: [{ model: Broker }, { model: Project }] });
      return ok(res, mappings);
    }
    if (req.method === "POST") { const parsed = schema.safeParse(req.body); if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? "Validation error"); const r = await BrokerProjectMapping.create(parsed.data as any); return created(res, r); }
    if (req.method === "PUT") { const { id, ...data } = req.body; if (!id) return badRequest(res, "ID required"); await BrokerProjectMapping.update(data, { where: { id } }); return ok(res, await BrokerProjectMapping.findByPk(id)); }
    if (req.method === "DELETE") { const { id } = req.body; await BrokerProjectMapping.destroy({ where: { id } }); return ok(res, null, "Deleted"); }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
