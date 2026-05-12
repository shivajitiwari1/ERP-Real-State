import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

type NavChild = { label: string; href: string; };
type NavItem = { label: string; href?: string; children?: NavChild[]; };
type NavModule = { label: string; icon: string; items: NavItem[]; };

const NAV: NavModule[] = [
  {
    label: 'Set Master', icon: '⚙️',
    items: [
      { label: 'Company Creation', href: '/master/company' },
      { label: 'Set Up', children: [
        { label: 'Project Type', href: '/master/setup/project-type' },
        { label: 'Area Type', href: '/master/setup/area-type' },
        { label: 'Currency', href: '/master/setup/currency' },
        { label: 'Customer Profession', href: '/master/setup/profession' },
        { label: 'Company Bank', href: '/master/setup/bank/company' },
        { label: 'Customer Bank', href: '/master/setup/bank/customer' },
        { label: 'Loan Bank', href: '/master/setup/bank/loan' },
        { label: 'Country Master', href: '/master/setup/country' },
        { label: 'Letter Head', href: '/master/setup/letterhead' },
        { label: 'Activity Reminders', href: '/master/setup/reminders' },
      ]},
      { label: 'Employee', children: [
        { label: 'Department', href: '/master/employee/department' },
        { label: 'Employee Info', href: '/master/employee/info' },
        { label: 'Set Manager', href: '/master/employee/manager' },
        { label: 'Team Master', href: '/master/employee/team' },
        { label: 'Create Login', href: '/master/login/create' },
        { label: 'View Login', href: '/master/login/view' },
      ]},
      { label: 'Security', children: [
        { label: 'Change Password', href: '/master/security/password' },
        { label: 'Login History', href: '/master/security/history' },
        { label: 'IP Security', href: '/master/security/ip' },
      ]},
      { label: 'Roles & Menus', children: [
        { label: 'Role Creation', href: '/master/roles/create' },
        { label: 'Role Wise Menus', href: '/master/roles/menus' },
      ]},
      { label: 'Admin', children: [
        { label: 'Customer Audit Track', href: '/master/admin/audit' },
        { label: 'Receipt Locking', href: '/master/admin/receipt-lock' },
        { label: 'Delete Customer', href: '/master/admin/delete-customer' },
        { label: 'Delete Receipt', href: '/master/admin/delete-receipt' },
      ]},
    ],
  },
  {
    label: 'Set Projects', icon: '🏗️',
    items: [
      { label: 'Create Project', children: [
        { label: 'Add Project', href: '/projects/create/project' },
        { label: 'Add Tower/Plot', href: '/projects/create/tower' },
        { label: 'Floor Creation', href: '/projects/create/floor' },
        { label: 'Unit Type Creation', href: '/projects/create/unit-type' },
        { label: 'Floor Wise Units', href: '/projects/create/units' },
      ]},
      { label: 'Edit Project', children: [
        { label: 'Edit Project', href: '/projects/edit/project' },
        { label: 'Edit Tower', href: '/projects/edit/tower' },
        { label: 'Edit Floor', href: '/projects/edit/floor' },
      ]},
      { label: 'Payment Plan', children: [
        { label: 'Payment Plan Creation', href: '/projects/payment-plan/create' },
        { label: 'Stage Master', href: '/projects/payment-plan/stages' },
        { label: 'Set Booking Amount', href: '/projects/payment-plan/booking-amount' },
        { label: 'Create Installment', href: '/projects/payment-plan/installment' },
        { label: 'Reminder Days', href: '/projects/payment-plan/reminders' },
      ]},
      { label: 'Rate', children: [
        { label: 'Change Rate', href: '/projects/rate/change' },
        { label: 'Rate Report', href: '/projects/rate/report' },
      ]},
      { label: 'Charge Masters', children: [
        { label: 'Other Charges', href: '/projects/setup/other-charge' },
        { label: 'PLC Charges', href: '/projects/setup/plc' },
        { label: 'Addon Charges', href: '/projects/setup/addon' },
        { label: 'IFMS Charges', href: '/projects/setup/ifms' },
        { label: 'Tax Master', href: '/projects/setup/tax' },
        { label: 'GST Config', href: '/projects/setup/gst' },
      ]},
    ],
  },
  {
    label: 'Application', icon: '📋',
    items: [
      { label: 'Booking', children: [
        { label: 'New Booking', href: '/application/booking/new' },
        { label: 'Customer Register', href: '/application/booking/list' },
        { label: 'Edit Booking', href: '/application/booking/edit' },
        { label: 'Unit Shift', href: '/application/booking/shift' },
      ]},
      { label: 'Agreement', children: [
        { label: 'Agreement Form', href: '/application/agreement/form' },
        { label: 'Cancellation', href: '/application/agreement/cancellation' },
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
        { label: 'Cheque Status', href: '/application/banking/status' },
      ]},
      { label: 'Interest', children: [
        { label: 'Interest Scheduler', href: '/application/interest/scheduler' },
        { label: 'Interest Waiver', href: '/application/interest/waiver' },
        { label: 'Grace Period', href: '/application/interest/grace' },
      ]},
      { label: 'Surrender', children: [
        { label: 'Application', href: '/application/surrender/apply' },
        { label: 'Report', href: '/application/surrender/report' },
      ]},
      { label: 'Transfer', children: [
        { label: 'Application', href: '/application/transfer/apply' },
        { label: 'Transfer Report', href: '/application/transfer/report' },
      ]},
      { label: 'Print / Docs', children: [
        { label: 'Print Demand', href: '/application/print/demand' },
        { label: 'Applicant Ledger', href: '/application/print/ledger' },
        { label: 'Loan Process', href: '/application/loan' },
      ]},
    ],
  },
  {
    label: 'Reports', icon: '📊',
    items: [
      { label: 'Inventory', children: [
        { label: 'Unit Status', href: '/reports/inventory/unit-status' },
        { label: 'Availability Sheet', href: '/reports/inventory/availability' },
        { label: 'Unit Sold', href: '/reports/inventory/unit-sold' },
        { label: 'Tower Wise', href: '/reports/inventory/tower-wise' },
        { label: 'Type Wise', href: '/reports/inventory/type-wise' },
      ]},
      { label: 'Applicant', children: [
        { label: 'Search Customer', href: '/reports/applicant/search' },
        { label: 'Payment File', href: '/reports/applicant/payment-file' },
        { label: 'Master Report', href: '/reports/applicant/master' },
        { label: 'Customer Detail', href: '/reports/applicant/customer-detail' },
        { label: 'Birthday Report', href: '/reports/applicant/birthday' },
      ]},
      { label: 'Collection', children: [
        { label: 'Collection Report', href: '/reports/collection' },
        { label: 'Customer Wise', href: '/reports/collection/customer-wise' },
        { label: 'Charges Wise', href: '/reports/collection/charges-wise' },
        { label: 'Customer Balance', href: '/reports/collection/customer-balance' },
      ]},
      { label: 'Dues', children: [
        { label: 'Due Report', href: '/reports/dues' },
        { label: 'Customer Wise Dues', href: '/reports/dues/customer-wise' },
        { label: 'Due Date Wise', href: '/reports/dues/due-date-wise' },
        { label: 'Ageing MIS', href: '/reports/dues/ageing-mis' },
      ]},
      { label: 'Sales', children: [
        { label: 'Cumulative Sales', href: '/reports/sales' },
        { label: 'Tower Wise Sales', href: '/reports/sales/tower-wise' },
        { label: 'Project Summary', href: '/reports/sales/project-summary' },
        { label: 'Booking Record', href: '/reports/sales/booking-record' },
      ]},
      { label: 'Financial', children: [
        { label: 'Bank Ledger', href: '/reports/financial/bank-ledger' },
        { label: 'Bank Wise Balance', href: '/reports/financial/bank-balance' },
      ]},
      { label: 'MIS', children: [
        { label: 'Project Wise', href: '/reports/mis/project-wise' },
        { label: 'Company Wise', href: '/reports/mis/company-wise' },
      ]},
    ],
  },
  {
    label: 'Broker', icon: '🤝',
    items: [
      { label: 'Add Broker', href: '/broker/application' },
      { label: 'View / Edit', href: '/broker/view' },
      { label: 'Project Mapping', href: '/broker/project-mapping' },
      { label: 'Broker Reports', children: [
        { label: 'Summary', href: '/broker/reports/summary' },
        { label: 'Sold Units', href: '/broker/reports/sold-units' },
        { label: 'Broker Wise Booking', href: '/broker/reports/booking' },
      ]},
      { label: 'Hold Units', children: [
        { label: 'Hold Unit', href: '/broker/hold/hold' },
        { label: 'Unhold Unit', href: '/broker/hold/unhold' },
      ]},
    ],
  },
  {
    label: 'Email / SMS', icon: '📨',
    items: [
      { label: 'Email Setup', href: '/communication/email/setup' },
      { label: 'Email History', href: '/communication/email/history' },
      { label: 'SMS Setup', href: '/communication/sms/setup' },
      { label: 'SMS Tracker', href: '/communication/sms/tracker' },
      { label: 'Send Email / SMS', href: '/communication/send' },
      { label: 'Address Book', href: '/communication/address-book' },
    ],
  },
  {
    label: 'Possession', icon: '🏠',
    items: [
      { label: 'Possession Date', href: '/possession/possession-date' },
      { label: 'Penalty Config', href: '/possession/penalty-config' },
      { label: 'Holding Charge', href: '/possession/holding-charge' },
      { label: 'Handover', href: '/possession/handover' },
      { label: 'NOC Request', href: '/possession/noc-request' },
      { label: 'Registry Report', href: '/possession/registry' },
      { label: 'Final Statement', href: '/possession/final-statement' },
    ],
  },
];

function SubItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  if (item.href && !item.children) {
    return (
      <Link href={item.href} className="erp-dropdown-item" onClick={onClose}>
        {item.label}
      </Link>
    );
  }
  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} style={{ position: 'relative' }}>
      <div className="erp-dropdown-item" style={{ justifyContent: 'space-between', paddingRight: 10 }}>
        <span>{item.label}</span>
        <span style={{ fontSize: 9, opacity: 0.5 }}>▶</span>
      </div>
      {open && item.children && (
        <div className="erp-dropdown animate-fade-in" style={{ position: 'absolute', left: '100%', top: 0, minWidth: 190 }}>
          {item.children.map(child => (
            <Link key={child.href} href={child.href} className="erp-dropdown-item" onClick={onClose}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const router = useRouter();
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter(label: string) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(label);
  }
  function handleLeave() {
    closeTimeout.current = setTimeout(() => setOpen(null), 120);
  }

  return (
    <nav style={{ background: 'var(--bg-navbar)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 54, zIndex: 40, transition: 'background 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', maxWidth: '100%', overflowX: 'auto', padding: '0 8px' }}>
        {NAV.map(module => (
          <div key={module.label} style={{ position: 'relative' }} onMouseEnter={() => handleEnter(module.label)} onMouseLeave={handleLeave}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 42, background: open === module.label ? 'rgba(249,115,22,0.12)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap', color: open === module.label ? '#F97316' : '#94A3B8', fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 12.5, borderBottom: open === module.label ? '2px solid #F97316' : '2px solid transparent' }}>
              <span style={{ fontSize: 13 }}>{module.icon}</span>
              {module.label}
              <span style={{ fontSize: 8, opacity: 0.6, marginLeft: 1 }}>▾</span>
            </button>

            {open === module.label && (
              <div className="erp-dropdown" style={{ top: '100%', left: 0 }}>
                {/* Direct href items */}
                {module.items.filter(i => i.href && !i.children).map(item => (
                  <Link key={item.href} href={item.href!} className="erp-dropdown-item" onClick={() => setOpen(null)}>
                    {item.label}
                  </Link>
                ))}
                {/* Group items */}
                {module.items.filter(i => !i.href || i.children).length > 0 && (
                  <>
                    {module.items.filter(i => i.children || (!i.href)).map((item, idx) => (
                      <div key={item.label}>
                        {idx === 0 && module.items.some(x => x.href && !x.children) && (
                          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
                        )}
                        <SubItem item={item} onClose={() => setOpen(null)} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
