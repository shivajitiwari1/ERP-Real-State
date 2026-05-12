import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { syncDatabase, Department, Role, Employee, User } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') return res.status(404).end();
  try {
    await syncDatabase();
    const [role] = await Role.findOrCreate({ where: { name: 'Admin' }, defaults: { description: 'Full access' } });
    const [dept] = await Department.findOrCreate({ where: { name: 'IT' } });
    const [emp] = await Employee.findOrCreate({
      where: { code: 'EMP001' },
      defaults: {
        code: 'EMP001', salutation: 'Mr.', firstName: 'Admin', lastName: 'User',
        departmentId: dept.id, mobile: '9999999999', email: 'admin@realboost.com',
        isAdmin: true, isTransfer: false, roleType: 'employee', isActive: true,
      },
    });
    const passwordHash = await bcrypt.hash('admin@123', 12);
    const [user, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: { employeeId: emp.id, username: 'admin', passwordHash, roleId: role.id, isActive: true },
    });
    res.json({ success: true, message: created ? 'Seeded successfully' : 'Already exists', userId: user.id });
  } catch (err) {
    res.status(500).json({ success: false, message: String(err) });
  }
}
