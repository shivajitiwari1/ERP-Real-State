import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SmsLog } from "@/models";
import { ok, unauthorized, serverError } from "@/lib/api-response";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") { const logs = await SmsLog.findAll({ order: [["sent_at", "DESC"]], limit: 200 }); return ok(res, logs); }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
