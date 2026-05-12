import Link from 'next/link';
import { useState } from 'react';

type NavChild = { label: string; href: string; };
type NavItem = { label: string; href?: string; children?: NavChild[]; };
type NavModule = { label: string; items: NavItem[]; };

const NAV: NavModule[] = [
  {
    label: 'Set Master',
    items: [
      { label: 'Company Creation', href: '/master/company' },
      { label: 'Set Up', children: [
        { label: 'Project Type Creation', href: '/master/setup/project-type' },
        { label: 'Area Type Creation', href: '/master/setup/area-type' },
        { label: 'Currency Configuration', href: '/master/setup/currency' },
        { label: 'Customer Profession', href: '/master/setup/profession' },
        { label: 'Company Bank', href: '/master/setup/bank/company' },
        { label: 'Customer Bank', href: '/master/setup/bank/customer' },
        { label: 'Loan Bank', href: '/master/setup/bank/loan' },
        { label: 'Country Master', href: '/master/setup/country' },
        { label: 'Letter Head Format', href: '/master/setup/letterhead' },
        { label: 'Activity Reminders', href: '/master/setup/reminders' },
      ]},
      { label: 'Employee Login Creation', children: [
        { label: 'Department', href: '/master/employee/department' },
        { label: 'Employee Information', href: '/master/employee/info' },
        { label: 'Report', href: '/master/employee/report' },
        { label: 'Set Manager', href: '/master/employee/manager' },
        { label: 'Team Master', href: '/master/employee/team' },
        { label: 'Employee Tree', href: '/master/employee/tree' },
        { label: 'Create Login', href: '/master/login/create' },
        { label: 'View Login', href: '/master/login/view' },
      ]},
      { label: 'Documents', children: [
        { label: 'Document Type Creation', href: '/master/documents/type' },
        { label: 'Document Dispatch Master', href: '/master/documents/dispatch-master' },
      ]},
      { label: 'Customized Letters', children: [
        { label: 'Create Letter', href: '/master/letters/create' },
      ]},
      { label: 'Security', children: [
        { label: 'Change Password', href: '/master/security/password' },
        { label: 'Login History', href: '/master/security/history' },
        { label: 'IP Security', href: '/master/security/ip' },
      ]},
      { label: 'Role and Menu', children: [
        { label: 'Role Creation', href: '/master/roles/create' },
        { label: 'Role Wise Menus', href: '/master/roles/menus' },
      ]},
      { label: 'Administrator Role', children: [
        { label: 'Customer Audit Track', href: '/master/admin/audit' },
        { label: 'Receipt Locking', href: '/master/admin/receipt-lock' },
        { label: 'Customer History', href: '/master/admin/history' },
        { label: 'Delete Customer', href: '/master/admin/delete-customer' },
        { label: 'Delete Receipt', href: '/master/admin/delete-receipt' },
      ]},
    ],
  },
  {
    label: 'Set Projects',
    items: [
      { label: 'Create Project', children: [
        { label: 'Add Project', href: '/projects/create/project' },
        { label: 'Add Tower/Plot', href: '/projects/create/tower' },
        { label: 'Add Base Floor', href: '/projects/create/base-floor' },
        { label: 'Floor Creation', href: '/projects/create/floor' },
        { label: 'Unit Type Creation', href: '/projects/create/unit-type' },
        { label: 'Floor Wise Unit Allocation', href: '/projects/create/units' },
      ]},
      { label: 'Edit Project', children: [
        { label: 'Edit Project', href: '/projects/edit/project' },
        { label: 'Edit Tower', href: '/projects/edit/tower' },
        { label: 'Edit Floor', href: '/projects/edit/floor' },
      ]},
      { label: 'Payment Plan Setup', children: [
        { label: 'Payment Plan Creation', href: '/projects/payment-plan/create' },
        { label: 'Stage Master', href: '/projects/payment-plan/stages' },
        { label: 'Set Booking Amount', href: '/projects/payment-plan/booking-amount' },
        { label: 'Create Installment', href: '/projects/payment-plan/installment' },
        { label: 'Reminder Days Config', href: '/projects/payment-plan/reminders' },
      ]},
      { label: 'Set Rate', children: [
        { label: 'Change Rate', href: '/projects/rate/change' },
        { label: 'Rate Report', href: '/projects/rate/report' },
      ]},
      { label: 'Project Set Up', children: [
        { label: 'Other Charges', href: '/projects/setup/other-charge' },
        { label: 'PLC Charges', href: '/projects/setup/plc' },
        { label: 'Addon Charges', href: '/projects/setup/addon' },
        { label: 'IFMS Charges', href: '/projects/setup/ifms' },
        { label: 'Tax Master', href: '/projects/setup/tax' },
        { label: 'GST Configuration', href: '/projects/setup/gst' },
        { label: 'Project Config Detail', href: '/projects/setup/project-config' },
      ]},
    ],
  },
  {
    label: 'Application',
    items: [
      { label: 'Booking', children: [
        { label: 'Booking Form (New)', href: '/application/booking/new' },
        { label: 'Edit Booking Form', href: '/application/booking/edit' },
        { label: 'Customer Register', href: '/application/booking/list' },
        { label: 'Unit Shifting Process', href: '/application/booking/shift' },
      ]},
      { label: 'Agreement of Unit', children: [
        { label: 'Agreement Form', href: '/application/agreement/form' },
        { label: 'Agreement Cancellation', href: '/application/agreement/cancellation' },
      ]},
      { label: 'Receipt Process', children: [
        { label: 'Receipt Generation', href: '/application/receipts/new' },
        { label: 'Receipt Register', href: '/application/receipts/list' },
        { label: 'Penalty Payment', href: '/application/receipts/penalty' },
        { label: 'Journal Entry', href: '/application/receipts/journal' },
        { label: 'Edit Receipt', href: '/application/receipts/edit' },
        { label: 'Cancel Receipt', href: '/application/receipts/cancel' },
      ]},
      { label: 'Demand Raise', children: [
        { label: 'Stage Wise', href: '/application/demand/stage' },
        { label: 'Tower Wise', href: '/application/demand/tower' },
        { label: 'Customer Wise', href: '/application/demand/customer' },
        { label: 'Installment Wise', href: '/application/demand/installment' },
        { label: 'Demand Unraise', href: '/application/demand/unraise' },
      ]},
      { label: 'Banking', children: [
        { label: 'Cheque Deposit', href: '/application/banking/deposit' },
        { label: 'Verify Cheque Status', href: '/application/banking/status' },
      ]},
      { label: 'Interest Calculation', children: [
        { label: 'Interest Scheduler', href: '/application/interest/scheduler' },
        { label: 'Interest Waiver', href: '/application/interest/waiver' },
        { label: 'Grace Period', href: '/application/interest/grace' },
      ]},
      { label: 'Print / Documents', children: [
        { label: 'Print Demand', href: '/application/print/demand' },
        { label: 'Applicant Ledger', href: '/application/print/ledger' },
        { label: 'Documents', href: '/application/documents' },
        { label: 'Loan Process', href: '/application/loan' },
      ]},
      { label: 'Surrender / Cancellation', children: [
        { label: 'Application', href: '/application/surrender/apply' },
        { label: 'Report', href: '/application/surrender/report' },
      ]},
      { label: 'Transfer', children: [
        { label: 'Application', href: '/application/transfer/apply' },
        { label: 'Transfer Report', href: '/application/transfer/report' },
      ]},
    ],
  },
  { label: 'Reports', items: [{ label: 'Coming in Phase 5', href: '/' }] },
  { label: 'Broker', items: [{ label: 'Coming in Phase 6', href: '/' }] },
  { label: 'Email / SMS', items: [{ label: 'Coming in Phase 7', href: '/' }] },
  { label: 'Possession', items: [{ label: 'Coming in Phase 8', href: '/' }] },
];

export default function NavMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav className="bg-slate-800 text-white relative z-40">
      <ul className="flex">
        {NAV.map(module => (
          <li key={module.label} className="relative"
            onMouseEnter={() => setOpen(module.label)}
            onMouseLeave={() => setOpen(null)}>
            <button className="px-4 py-3 text-sm font-medium hover:bg-slate-600 flex items-center gap-1 whitespace-nowrap">
              {module.label} <span className="text-xs opacity-70">▾</span>
            </button>
            {open === module.label && (
              <ul className="absolute left-0 top-full bg-white text-gray-800 shadow-xl z-50 min-w-52 border border-gray-200">
                {module.items.map(item => (
                  <li key={item.label} className="relative group/sub">
                    {item.href && !item.children ? (
                      <Link href={item.href} className="block px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-700">
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-orange-50 cursor-default font-medium text-gray-600">
                          <span>{item.label}</span>
                          <span className="text-xs">▶</span>
                        </div>
                        {item.children && (
                          <ul className="absolute left-full top-0 bg-white shadow-xl border border-gray-200 min-w-52 hidden group-hover/sub:block z-50">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link href={child.href} className="block px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-700">
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
