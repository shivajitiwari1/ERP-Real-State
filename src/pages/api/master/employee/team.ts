import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Employee, Department } from "@/models";
import { ok, unauthorized, serverError } from "@/lib/api-response";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === "GET") {
      const { departmentId } = req.query;
      const where: any = { isActive: true };
      if (departmentId) where.departmentId = Number(departmentId);
      const employees = await Employee.findAll({ where, include: [{ model: Department }], order: [["first_name", "ASC"]] });
      return ok(res, employees);
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
