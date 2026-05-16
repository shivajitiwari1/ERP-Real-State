import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FinalStatement, Booking, Applicant, Receipt, Demand } from "@/models";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { z } from "zod";
const schema = z.object({ bookingId: z.number().int().positive(), totalCost: z.number().min(0).default(0), totalPaid: z.number().min(0).default(0), balance: z.number().default(0), generatedDate: z.string().min(1) });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") {
      const { projectId, bookingId } = req.query;
      const where: any = bookingId ? { bookingId: Number(bookingId) } : {};
      const records = await FinalStatement.findAll({ where, include: [{ model: Booking, where: projectId ? { projectId: Number(projectId) } : {}, include: [{ model: Applicant, where: { applicantType: "primary" }, required: false }] }], order: [["generated_date", "DESC"]] });
      return ok(res, records);
    }
    if (req.method === "POST") { const parsed = schema.safeParse(req.body); if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? "Validation error"); const r = await FinalStatement.create(parsed.data as any); return created(res, r); }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
