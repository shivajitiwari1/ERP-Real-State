import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';

type NavChild = { label: string; href: string; };
type NavItem  = { label: string; href?: string; children?: NavChild[]; };
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
        { label: 'Profession', href: '/master/setup/profession' },
        { label: 'Company Bank', href: '/master/setup/bank/company' },
        { label: 'Customer Bank', href: '/master/setup/bank/customer' },
        { label: 'Loan Bank', href: '/master/setup/bank/loan' },
        { label: 'Country Master', href: '/master/setup/country' },
      ]},
      { label: 'Employee', children: [
        { label: 'Department', href: '/master/employee/department' },
        { label: 'Employee Info', href: '/master/employee/info' },
        { label: 'Set Manager', href: '/master/employee/manager' },
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
        { label: 'Customer Audit', href: '/master/admin/audit' },
        { label: 'Receipt Locking', href: '/master/admin/receipt-lock' },
        { label: 'Delete Customer', href: '/master/admin/delete-customer' },
        { label: 'Delete Receipt', href: '/master/admin/delete-receipt' },
      ]},
    ],
  },
  {
    label: 'Set Projects', icon: '🏗️',
    items: [
      { label: 'Add Project', href: '/projects/create/project' },
      { label: 'Add Tower/Plot', href: '/projects/create/tower' },
      { label: 'Floor Creation', href: '/projects/create/floor' },
      { label: 'Unit Type', href: '/projects/create/unit-type' },
      { label: 'Allocate Units', href: '/projects/create/units' },
      { label: 'Edit Project', href: '/projects/edit/project' },
      { label: 'Payment Plan', children: [
        { label: 'Create Plan', href: '/projects/payment-plan/create' },
        { label: 'Stage Master', href: '/projects/payment-plan/stages' },
        { label: 'Create Installment', href: '/projects/payment-plan/installment' },
        { label: 'Booking Amount', href: '/projects/payment-plan/booking-amount' },
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
      { label: 'New Booking', href: '/application/booking/new' },
      { label: 'Customer Register', href: '/application/booking/list' },
      { label: 'Agreement Form', href: '/application/agreement/form' },
      { label: 'Receipt', children: [
        { label: 'Receipt Generation', href: '/application/receipts/new' },
        { label: 'Receipt Register', href: '/application/receipts/list' },
        { label: 'Penalty Payment', href: '/application/receipts/penalty' },
        { label: 'Journal Entry', href: '/application/receipts/journal' },
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
      { label: 'Surrender / Transfer', children: [
        { label: 'Surrender', href: '/application/surrender/apply' },
        { label: 'Transfer', href: '/application/transfer/apply' },
        { label: 'Unit Shift', href: '/application/booking/shift' },
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
      { label: 'Unit Status', href: '/reports/inventory/unit-status' },
      { label: 'Search Customer', href: '/reports/applicant/search' },
      { label: 'Collection Report', href: '/reports/collection' },
      { label: 'Due Report', href: '/reports/dues' },
      { label: 'Sales Report', href: '/reports/sales' },
      { label: 'Inventory', children: [
        { label: 'Availability Sheet', href: '/reports/inventory/availability' },
        { label: 'Unit Sold', href: '/reports/inventory/unit-sold' },
        { label: 'Tower Wise', href: '/reports/inventory/tower-wise' },
        { label: 'Type Wise', href: '/reports/inventory/type-wise' },
      ]},
      { label: 'Applicant Detail', children: [
        { label: 'Payment File', href: '/reports/applicant/payment-file' },
        { label: 'Master Report', href: '/reports/applicant/master' },
        { label: 'Customer Detail', href: '/reports/applicant/customer-detail' },
        { label: 'Birthday Report', href: '/reports/applicant/birthday' },
      ]},
      { label: 'Collection', children: [
        { label: 'Customer Wise', href: '/reports/collection/customer-wise' },
        { label: 'Charges Wise', href: '/reports/collection/charges-wise' },
        { label: 'Customer Balance', href: '/reports/collection/customer-balance' },
      ]},
      { label: 'Dues', children: [
        { label: 'Customer Wise Dues', href: '/reports/dues/customer-wise' },
        { label: 'Due Date Wise', href: '/reports/dues/due-date-wise' },
        { label: 'Ageing MIS', href: '/reports/dues/ageing-mis' },
      ]},
      { label: 'Sales', children: [
        { label: 'Tower Wise Sales', href: '/reports/sales/tower-wise' },
        { label: 'Project Summary', href: '/reports/sales/project-summary' },
        { label: 'Booking Record', href: '/reports/sales/booking-record' },
      ]},
      { label: 'Financial', children: [
        { label: 'Bank Ledger', href: '/reports/financial/bank-ledger' },
        { label: 'Bank Balance', href: '/reports/financial/bank-balance' },
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
      { label: 'Sub Broker', href: '/broker/sub-broker' },
      { label: 'Reports', children: [
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
      { label: 'Email Test', href: '/communication/email/test' },
      { label: 'SMS Setup', href: '/communication/sms/setup' },
      { label: 'SMS Tracker', href: '/communication/sms/tracker' },
      { label: 'Send Email / SMS', href: '/communication/send' },
      { label: 'Address Book', href: '/communication/address-book' },
      { label: 'Address Groups', href: '/communication/address-book/groups' },
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

/* ── Sub-item with fly-out ── */
function SubItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  if (item.href && !item.children) {
    return (
      <Link href={item.href} className="erp-dropdown-item" onClick={onClose}
        style={{ fontSize: 13, padding: '9px 16px', color: 'var(--text)' }}>
        {item.label}
      </Link>
    );
  }

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <div className="erp-dropdown-item"
        style={{ justifyContent: 'space-between', fontSize: 13, padding: '9px 16px', color: 'var(--text)', fontWeight: 500 }}>
        <span>{item.label}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 16 }}>›</span>
      </div>
      {open && item.children && (
        <div className="erp-dropdown"
          style={{ position: 'absolute', left: '100%', top: -1, minWidth: 200, zIndex: 300 }}>
          {item.children.map(child => (
            <Link key={child.href} href={child.href} className="erp-dropdown-item"
              style={{ fontSize: 13, padding: '9px 16px', color: 'var(--text)' }}
              onClick={onClose}>
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main NavMenu ── */
export default function NavMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(null); }, [router.asPath]);

  function toggle(label: string) {
    setOpen(prev => prev === label ? null : label);
  }

  return (
    <nav ref={navRef}
      style={{ background: 'var(--bg-navbar)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 54, zIndex: 50, transition: 'background 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto', padding: '0 6px' }}>
        {NAV.map(module => {
          const isOpen = open === module.label;
          return (
            <div key={module.label} style={{ position: 'relative', flexShrink: 0 }}>
              {/* Module button — click to open */}
              <button
                onClick={() => toggle(module.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 13px', height: 42,
                  background: isOpen ? 'rgba(249,115,22,0.14)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s ease', whiteSpace: 'nowrap',
                  color: isOpen ? '#F97316' : '#94A3B8',
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12.5,
                  borderBottom: isOpen ? '2px solid #F97316' : '2px solid transparent',
                }}>
                <span style={{ fontSize: 14 }}>{module.icon}</span>
                {module.label}
                <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 2, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', display: 'inline-block' }}>▾</span>
              </button>

              {/* Dropdown panel */}
              {isOpen && (
                <div
                  className="erp-dropdown"
                  style={{ position: 'absolute', top: '100%', left: 0, minWidth: 220, maxHeight: '80vh', overflowY: 'auto' }}>
                  {module.items.map((item) => (
                    <SubItem key={item.label} item={item} onClose={() => setOpen(null)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
