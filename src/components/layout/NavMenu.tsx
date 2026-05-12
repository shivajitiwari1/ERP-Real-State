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
  {
    label: 'Reports',
    items: [
      { label: 'Inventory', children: [
        { label: 'Unit Status', href: '/reports/inventory/unit-status' },
        { label: 'Availability Sheet', href: '/reports/inventory/availability' },
        { label: 'Unit Sold', href: '/reports/inventory/unit-sold' },
        { label: 'Tower Wise Unit Status', href: '/reports/inventory/tower-wise' },
        { label: 'Type Wise Unit Status', href: '/reports/inventory/type-wise' },
        { label: 'Unit Cost', href: '/reports/inventory/unit-cost' },
      ]},
      { label: 'Applicant Detail', children: [
        { label: 'Search Customer', href: '/reports/applicant/search' },
        { label: 'Applicant Payment File', href: '/reports/applicant/payment-file' },
        { label: 'Master Report', href: '/reports/applicant/master' },
        { label: 'Customer Detail', href: '/reports/applicant/customer-detail' },
        { label: 'Birthday Report', href: '/reports/applicant/birthday' },
      ]},
      { label: 'Collection', children: [
        { label: 'Collection Report', href: '/reports/collection' },
        { label: 'Customer Wise Collection', href: '/reports/collection/customer-wise' },
        { label: 'Charges Wise Collection', href: '/reports/collection/charges-wise' },
        { label: 'Customer Wise Balance', href: '/reports/collection/customer-balance' },
      ]},
      { label: 'Dues', children: [
        { label: 'Due Report', href: '/reports/dues' },
        { label: 'Customer Wise Dues', href: '/reports/dues/customer-wise' },
        { label: 'Due Date Wise', href: '/reports/dues/due-date-wise' },
        { label: 'Ageing MIS', href: '/reports/dues/ageing-mis' },
      ]},
      { label: 'Sales Reports', children: [
        { label: 'Cumulative Sales', href: '/reports/sales' },
        { label: 'Tower Wise Sales', href: '/reports/sales/tower-wise' },
        { label: 'Project Summary', href: '/reports/sales/project-summary' },
        { label: 'Booking Record', href: '/reports/sales/booking-record' },
      ]},
      { label: 'Financial', children: [
        { label: 'Bank Ledger', href: '/reports/financial/bank-ledger' },
        { label: 'Bank Wise Balance', href: '/reports/financial/bank-balance' },
      ]},
      { label: 'Charge Detail', children: [
        { label: 'Other Charge Report', href: '/reports/charges/other-charge' },
        { label: 'Parking Report', href: '/reports/charges/parking' },
        { label: 'PLC Report', href: '/reports/charges/plc' },
        { label: 'IFMS Report', href: '/reports/charges/ifms' },
        { label: 'Addon Report', href: '/reports/charges/addon' },
      ]},
      { label: 'MIS', children: [
        { label: 'Project Wise Summary', href: '/reports/mis/project-wise' },
        { label: 'Company Wise Summary', href: '/reports/mis/company-wise' },
      ]},
    ],
  },
  {
    label: 'Broker',
    items: [
      { label: 'Broker', children: [
        { label: 'Application (Add Broker)', href: '/broker/application' },
        { label: 'View / Edit', href: '/broker/view' },
        { label: 'Project Mapping', href: '/broker/project-mapping' },
        { label: 'Sub Broker Mapping', href: '/broker/sub-broker' },
      ]},
      { label: 'Broker Setup', children: [
        { label: 'Broker TDS Master', href: '/broker/setup/tds-master' },
        { label: 'Broker Service Tax Master', href: '/broker/setup/service-tax' },
      ]},
      { label: 'Broker Reports', children: [
        { label: 'Summary', href: '/broker/reports/summary' },
        { label: 'Sold Units', href: '/broker/reports/sold-units' },
        { label: 'Broker Wise Booking', href: '/broker/reports/booking' },
      ]},
      { label: 'Investor / Hold', children: [
        { label: 'Hold Unit', href: '/broker/hold/hold' },
        { label: 'Unhold Unit', href: '/broker/hold/unhold' },
      ]},
    ],
  },
  {
    label: 'Email / SMS',
    items: [
      { label: 'Email', children: [
        { label: 'Email Setup', href: '/communication/email/setup' },
        { label: 'Email Test', href: '/communication/email/test' },
        { label: 'Email History', href: '/communication/email/history' },
      ]},
      { label: 'SMS', children: [
        { label: 'SMS Setup', href: '/communication/sms/setup' },
        { label: 'SMS Tracker', href: '/communication/sms/tracker' },
      ]},
      { label: 'Send Email / SMS', href: '/communication/send' },
      { label: 'Address Book', children: [
        { label: 'Address Book', href: '/communication/address-book' },
        { label: 'Groups', href: '/communication/address-book/groups' },
      ]},
    ],
  },
  {
    label: 'Possession',
    items: [
      { label: 'Possession Date', href: '/possession/possession-date' },
      { label: 'Penalty', children: [
        { label: 'Penalty Configuration', href: '/possession/penalty-config' },
      ]},
      { label: 'Holding', children: [
        { label: 'Holding Charge Master', href: '/possession/holding-charge' },
        { label: 'Handover', href: '/possession/handover' },
      ]},
      { label: 'Registry Report', href: '/possession/registry' },
      { label: 'Customer NOC Request', href: '/possession/noc-request' },
      { label: 'Final Statement', href: '/possession/final-statement' },
    ],
  },
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
