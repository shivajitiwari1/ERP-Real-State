import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RegistryRecord, Booking, Applicant, Project } from "@/models";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { z } from "zod";
const schema = z.object({ bookingId: z.number().int().positive(), registryDate: z.string().min(1), stampDuty: z.number().min(0).default(0), registrationCharges: z.number().min(0).default(0), total: z.number().min(0).default(0), remarks: z.string().optional() });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") {
      const { projectId } = req.query;
      const records = await RegistryRecord.findAll({ include: [{ model: Booking, where: projectId ? { projectId: Number(projectId) } : {}, include: [{ model: Applicant, where: { applicantType: "primary" }, required: false }] }], order: [["registry_date", "DESC"]], limit: 200 });
      return ok(res, records);
    }
    if (req.method === "POST") { const parsed = schema.safeParse(req.body); if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? "Validation error"); const r = await RegistryRecord.create(parsed.data as any); return created(res, r); }
    if (req.method === "PUT") { const { id, ...data } = req.body; if (!id) return badRequest(res, "ID required"); await RegistryRecord.update(data, { where: { id } }); return ok(res, await RegistryRecord.findByPk(id)); }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
