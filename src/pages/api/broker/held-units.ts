import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeldUnit, Broker, Unit } from "@/models";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { z } from "zod";
const schema = z.object({ brokerId: z.number().int().positive(), unitId: z.number().int().positive(), projectId: z.number().int().positive(), holdDate: z.string().min(1), status: z.enum(["held","released"]).default("held") });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") {
      const { projectId, status } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      if (status) where.status = status;
      const held = await HeldUnit.findAll({ where, include: [{ model: Broker }, { model: Unit }], order: [["hold_date", "DESC"]] });
      return ok(res, held);
    }
    if (req.method === "POST") { const parsed = schema.safeParse(req.body); if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? "Validation error"); const r = await HeldUnit.create(parsed.data as any); return created(res, r); }
    if (req.method === "PUT") { const { id, ...data } = req.body; if (!id) return badRequest(res, "ID required"); await HeldUnit.update(data, { where: { id } }); return ok(res, await HeldUnit.findByPk(id)); }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
