import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JournalEntry, Booking, Applicant } from "@/models";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { z } from "zod";
const schema = z.object({ bookingId: z.number().int().positive(), projectId: z.number().int().positive(), entryDate: z.string().min(1), amount: z.number(), entryType: z.enum(["JV","DR","CR","Refund"]).default("JV"), narration: z.string().optional() });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") {
      const { projectId, bookingId } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      if (bookingId) where.bookingId = Number(bookingId);
      const entries = await JournalEntry.findAll({ where, include: [{ model: Booking, include: [{ model: Applicant, where: { applicantType: "primary" }, required: false }] }], order: [["entry_date", "DESC"]], limit: 200 });
      return ok(res, entries);
    }
    if (req.method === "POST") { const parsed = schema.safeParse(req.body); if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? "Validation error"); const r = await JournalEntry.create({ ...parsed.data, createdBy: (session.user as any).id } as any); return created(res, r); }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
