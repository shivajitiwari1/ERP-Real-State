import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') return res.status(404).end();
  try {
    // Step 1: Test DB
    const { default: sequelize } = await import('@/lib/db');
    await sequelize.authenticate();

    // Step 2: Test models
    const { User, Employee, Role } = await import('@/models');

    // Step 3: Find admin user
    const user = await User.findOne({ where: { username: 'admin' }, include: [{ model: Employee }, { model: Role }] });
    if (!user) return res.json({ step: 'user-not-found', fix: 'Call /api/seed first' });

    // Step 4: Test password
    const valid = await bcrypt.compare('admin@123', user.passwordHash);

    return res.json({
      status: 'ok',
      db: 'connected',
      user: { id: user.id, username: user.username, roleId: user.roleId, isActive: user.isActive },
      employee: { name: `${(user as any).Employee?.firstName} ${(user as any).Employee?.lastName}` },
      role: (user as any).Role?.name,
      passwordValid: valid,
      fix: valid ? 'Auth should work — restart dev server and try logging in' : 'Password mismatch — re-run /api/seed',
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message, fix: 'Check XAMPP MySQL is running and /api/sync was called' });
  }
}
