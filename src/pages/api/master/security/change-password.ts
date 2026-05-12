import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6)
      return badRequest(res, 'New password must be at least 6 characters');
    const user = await User.findOne({ where: { employeeId: (session.user as any).employeeId } });
    if (!user) return badRequest(res, 'User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return badRequest(res, 'Current password is incorrect');
    await user.update({ passwordHash: await bcrypt.hash(newPassword, 12) });
    return ok(res, null, 'Password changed successfully');
  } catch (err) { return serverError(res, err); }
}
