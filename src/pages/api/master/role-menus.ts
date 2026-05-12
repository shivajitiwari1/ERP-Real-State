import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RoleMenu } from '@/models';
import { ok, created, unauthorized, serverError } from '@/lib/api-response';

export const ALL_PAGES = [
  { url: '/master/company', name: 'Company Creation', category: 'Set Master' },
  { url: '/master/setup/project-type', name: 'Project Type', category: 'Set Master' },
  { url: '/master/setup/area-type', name: 'Area Type', category: 'Set Master' },
  { url: '/master/setup/currency', name: 'Currency', category: 'Set Master' },
  { url: '/master/setup/profession', name: 'Profession', category: 'Set Master' },
  { url: '/master/setup/bank/company', name: 'Company Bank', category: 'Set Master' },
  { url: '/master/setup/bank/customer', name: 'Customer Bank', category: 'Set Master' },
  { url: '/master/setup/bank/loan', name: 'Loan Bank', category: 'Set Master' },
  { url: '/master/setup/country', name: 'Country Master', category: 'Set Master' },
  { url: '/master/setup/letterhead', name: 'Letter Head Format', category: 'Set Master' },
  { url: '/master/setup/reminders', name: 'Activity Reminders', category: 'Set Master' },
  { url: '/master/employee/department', name: 'Department', category: 'Set Master' },
  { url: '/master/employee/info', name: 'Employee Information', category: 'Set Master' },
  { url: '/master/employee/report', name: 'Employee Report', category: 'Set Master' },
  { url: '/master/employee/manager', name: 'Set Manager', category: 'Set Master' },
  { url: '/master/employee/team', name: 'Team Master', category: 'Set Master' },
  { url: '/master/employee/tree', name: 'Employee Tree', category: 'Set Master' },
  { url: '/master/login/create', name: 'Create Login', category: 'Set Master' },
  { url: '/master/login/view', name: 'View Login', category: 'Set Master' },
  { url: '/master/documents/type', name: 'Document Type', category: 'Set Master' },
  { url: '/master/roles/create', name: 'Role Creation', category: 'Set Master' },
  { url: '/master/roles/menus', name: 'Role Wise Menus', category: 'Set Master' },
  { url: '/master/security/password', name: 'Change Password', category: 'Set Master' },
  { url: '/master/security/history', name: 'Login History', category: 'Set Master' },
  { url: '/master/security/ip', name: 'IP Security', category: 'Set Master' },
  { url: '/master/admin/audit', name: 'Customer Audit Track', category: 'Set Master' },
  { url: '/master/admin/receipt-lock', name: 'Receipt Locking', category: 'Set Master' },
  { url: '/master/admin/delete-customer', name: 'Delete Customer', category: 'Set Master' },
  { url: '/master/admin/delete-receipt', name: 'Delete Receipt', category: 'Set Master' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { roleId } = req.query;
      const assigned = await RoleMenu.findAll({ where: { roleId: Number(roleId) } });
      return ok(res, { allPages: ALL_PAGES, assigned });
    }
    if (req.method === 'POST') {
      const { roleId, pageUrls } = req.body;
      await RoleMenu.destroy({ where: { roleId } });
      if (pageUrls.length > 0) {
        const records = pageUrls.map((url: string) => {
          const page = ALL_PAGES.find(p => p.url === url)!;
          return { roleId, pageUrl: url, pageName: page?.name ?? url, category: page?.category ?? 'General', canView: true };
        });
        await RoleMenu.bulkCreate(records);
      }
      return created(res, null, 'Menus assigned successfully');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
