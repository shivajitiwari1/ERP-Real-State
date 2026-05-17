# Full Menu Sync + Missing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all 7 navigation modules in NavMenu.tsx to match the live ERP, and create stub pages for every missing route so no menu item leads to a 404.

**Architecture:** Single NavMenu.tsx rewrite replaces the NAV array (lines 9-228). Stub pages are minimal TSX files using the existing PageHeader component. No API changes, no model changes.

**Tech Stack:** Next.js 14 Pages Router · TypeScript · Tailwind CSS · existing PageHeader component

---

## Task 1: Rewrite NAV array in NavMenu.tsx

**Files:**
- Modify: `src/components/layout/NavMenu.tsx` (lines 9–228, the NAV constant only)

- [ ] **Step 1: Replace the entire NAV constant**

Open `src/components/layout/NavMenu.tsx`. Replace everything from `const NAV: NavModule[] = [` through the closing `];` (currently lines 9–228) with:

```typescript
const NAV: NavModule[] = [
  {
    label: 'Set Master', icon: '⚙️',
    items: [
      { label: 'Company Creation', href: '/master/company' },
      { label: 'Set Up', children: [
        { label: 'Project Type Creation', href: '/master/setup/project-type' },
        { label: 'Area Type Creation', href: '/master/setup/area-type' },
        { label: 'Currency Configuration', href: '/master/setup/currency' },
        { label: 'Customer Profession Configuration', href: '/master/setup/profession' },
        { label: 'Company Bank Creation', href: '/master/setup/bank/company' },
        { label: 'Customer Bank Creation', href: '/master/setup/bank/customer' },
        { label: 'Loan Bank Creation', href: '/master/setup/bank/loan' },
        { label: 'Country Master', href: '/master/setup/country' },
        { label: 'Letter Head Format', href: '/master/setup/letterhead' },
        { label: 'Activity Reminders', href: '/master/setup/reminders' },
      ]},
      { label: 'Employee Login Creation', children: [
        { label: 'Department', href: '/master/employee/department' },
        { label: 'Employee Information', href: '/master/employee/info' },
        { label: 'Employee Report', href: '/master/employee/report' },
        { label: 'Set Manager', href: '/master/employee/manager' },
        { label: 'Team Master', href: '/master/employee/team' },
        { label: 'Set Team Head', href: '/master/employee/team-head' },
        { label: 'Team Head Detail', href: '/master/employee/team-head-detail' },
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
        { label: 'Password/Code', href: '/master/security/password' },
        { label: 'Login History', href: '/master/security/history' },
        { label: 'IP Enable/Disable Security', href: '/master/security/ip-enable' },
        { label: 'Add IP Address', href: '/master/security/ip' },
      ]},
      { label: 'Role and Menu', children: [
        { label: 'Role Creation', href: '/master/roles/create' },
        { label: 'Role Wise Menus', href: '/master/roles/menus' },
        { label: 'Role Category Wise Page Hierarchy', href: '/master/roles/category' },
      ]},
      { label: 'Administrator Role', children: [
        { label: 'Customer Audit Track', href: '/master/admin/audit' },
        { label: 'Receipt Locking', href: '/master/admin/receipt-lock' },
        { label: 'Customer History', href: '/master/admin/customer-history' },
        { label: 'Delete Customer', href: '/master/admin/delete-customer' },
        { label: 'Delete Receipt', href: '/master/admin/delete-receipt' },
      ]},
    ],
  },
  {
    label: 'Set Projects', icon: '🏗️',
    items: [
      { label: 'Create Project', children: [
        { label: 'Add Tower/Plot', href: '/projects/create/tower' },
        { label: 'Add Base Floor', href: '/projects/create/base-floor' },
        { label: 'Floor Creation', href: '/projects/create/floor' },
        { label: 'Unit Type Creation', href: '/projects/create/unit-type' },
        { label: 'Floor Wise Unit Allocation', href: '/projects/create/units' },
        { label: 'Pre-Attach PLC/Other Charges', href: '/projects/setup/plc' },
        { label: 'Address Owner Master', href: '/projects/create/address-owner' },
        { label: 'Unit Location Creation', href: '/projects/create/unit-location' },
      ]},
      { label: 'Edit Project', children: [
        { label: 'Edit Project', href: '/projects/edit/project' },
        { label: 'Edit Tower', href: '/projects/edit/tower' },
        { label: 'Edit Floor', href: '/projects/edit/floor' },
        { label: 'Add Plot', href: '/projects/edit/plot' },
        { label: 'Change Unit Type', href: '/projects/edit/unit-type' },
        { label: 'Change Floor Wise Unit Allocation', href: '/projects/edit/units' },
        { label: 'Change No. Of Plot/Villa', href: '/projects/edit/plot-villa' },
        { label: 'Edit Unit Address and Location', href: '/projects/edit/unit-address' },
        { label: 'Detach Unit Address', href: '/projects/edit/detach-address' },
        { label: 'Change Unit Area - Individual Unit Wise', href: '/projects/edit/unit-area' },
      ]},
      { label: 'Payment Plan Setup', children: [
        { label: 'New', href: '/projects/payment-plan/create' },
        { label: 'Edit', href: '/projects/payment-plan/edit' },
        { label: 'View', href: '/projects/payment-plan/view' },
        { label: 'Setup', href: '/projects/payment-plan/stages' },
      ]},
      { label: 'Set Rate', children: [
        { label: 'Change Rate', href: '/projects/rate/change' },
        { label: 'Change Charges Rate', href: '/projects/rate/charges' },
        { label: 'Rate Report', href: '/projects/rate/report' },
      ]},
      { label: 'Project Set Up', children: [
        { label: 'Charge Master', href: '/projects/setup/other-charge' },
        { label: 'Service Tax Configuration', href: '/projects/setup/tax' },
        { label: 'GST', href: '/projects/setup/gst' },
        { label: 'Automated/Manual', href: '/projects/setup/automated' },
        { label: 'Customer Classification', href: '/projects/setup/customer-classification' },
        { label: 'Project Configuration Detail', href: '/projects/setup/project-config' },
      ]},
      { label: 'UDSL Setup', children: [
        { label: 'Group Assign', href: '/projects/setup/udsl/group-assign' },
        { label: 'Tax Configuration', href: '/projects/setup/udsl/tax-config' },
        { label: 'Project Wise Construction Cost', href: '/projects/setup/udsl/construction-cost' },
      ]},
    ],
  },
  {
    label: 'Application', icon: '📋',
    items: [
      { label: 'Booking', children: [
        { label: 'Booking Form', href: '/application/booking/new' },
        { label: 'Edit Booking Form', href: '/application/booking/edit' },
        { label: 'Shift Units', href: '/application/booking/shift' },
        { label: 'Unit Shift Report', href: '/application/booking/unit-shift-report' },
        { label: 'Booking Status', href: '/application/booking/booking-status' },
        { label: 'Editing Status', href: '/application/booking/editing-status' },
        { label: 'Applicant Addition/Deletion', href: '/application/booking/applicant-addition' },
        { label: 'Head Wise Cost', href: '/application/booking/head-wise-cost' },
        { label: 'Edit Customer Address', href: '/application/booking/edit-address' },
        { label: 'Customer Register', href: '/application/booking/list' },
      ]},
      { label: 'Agreement of Unit', children: [
        { label: 'Agreement Form', href: '/application/agreement/form' },
        { label: 'Agreement Cancellation', href: '/application/agreement/cancellation' },
        { label: 'Provisional Allotment', href: '/application/agreement/provisional-allotment' },
        { label: 'Allotment & Agreement Status', href: '/application/agreement/allotment-status' },
      ]},
      { label: 'Receipt Process', children: [
        { label: 'Receipt Generation', href: '/application/receipts/new' },
        { label: 'Duplicate Receipt Generation', href: '/application/receipts/duplicate' },
        { label: 'Penalty Payment', href: '/application/receipts/penalty' },
        { label: 'Journal Entry', href: '/application/receipts/journal' },
        { label: 'Debit/Credit', href: '/application/receipts/debit-credit' },
        { label: 'Journal Report', href: '/application/receipts/journal-report' },
        { label: 'JV/Dr/Cr/Refund Reversal', href: '/application/receipts/jv-reversal' },
        { label: 'Edit Receipt', href: '/application/receipts/edit' },
        { label: 'Edit Head Wise Receipt', href: '/application/receipts/edit-head-wise' },
        { label: 'Cancel Receipt', href: '/application/receipts/cancel' },
        { label: 'Cancel Receipt Report', href: '/application/receipts/cancel-report' },
        { label: 'Cumulative Receipt Book', href: '/application/receipts/cumulative' },
        { label: 'Reset Receipt', href: '/application/receipts/reset' },
        { label: 'Assign Receipt Challan', href: '/application/receipts/assign-challan' },
        { label: 'Receipt Register', href: '/application/receipts/list' },
        { label: 'Payment Clear Delay Report', href: '/application/receipts/payment-delay' },
        { label: 'Penalty Payment Report', href: '/application/receipts/penalty-report' },
      ]},
      { label: 'Demand Raise', children: [
        { label: 'Stage Wise', href: '/application/demand/stage' },
        { label: 'Tower Wise', href: '/application/demand/tower' },
        { label: 'Customer Wise', href: '/application/demand/customer' },
        { label: 'Installment Wise', href: '/application/demand/installment' },
        { label: 'Demand Unraise', href: '/application/demand/unraise' },
      ]},
      { label: 'Printing of Document', children: [
        { label: 'Print Welcome', href: '/application/print/welcome' },
        { label: 'Print Demand', href: '/application/print/demand' },
        { label: 'Installment Wise Demand Status', href: '/application/print/installment-wise-demand' },
        { label: 'Print Demand Manually', href: '/application/print/demand-manually' },
        { label: 'Email Notification', href: '/application/print/email-notification' },
        { label: 'Agreement (BBA)', href: '/application/print/agreement-bba' },
        { label: 'TPA', href: '/application/print/tpa' },
        { label: 'Applicant Ledger', href: '/application/print/ledger' },
        { label: 'User Define Letters', href: '/application/print/user-define-letters' },
        { label: 'Address Labels', href: '/application/print/address-labels' },
      ]},
      { label: 'Banking', children: [
        { label: 'Cheque Deposit', href: '/application/banking/deposit' },
        { label: 'Verify Cheque Status', href: '/application/banking/verify-cheque' },
        { label: 'Change Cheque Status', href: '/application/banking/change-status' },
        { label: 'Clear/Bounce Cheque Report', href: '/application/banking/bounce-report' },
        { label: 'Cheque Represent', href: '/application/banking/represent' },
      ]},
      { label: 'Interest Calculation', children: [
        { label: 'Interest Scheduler', href: '/application/interest/scheduler' },
        { label: 'Interest Master (Project Wise)', href: '/application/interest/project-wise' },
        { label: 'Installment Wise Interest', href: '/application/interest/project-installment-wise' },
        { label: 'Customer Interest Master', href: '/application/interest/customer-wise' },
        { label: 'Delete Customer Interest', href: '/application/interest/customer-delete' },
        { label: 'Customer Installment Wise Interest', href: '/application/interest/customer-installment-wise' },
        { label: 'Manual Interest', href: '/application/interest/customer-manual' },
        { label: 'Interest Waive Off Letter', href: '/application/interest/waive-letter' },
        { label: 'Interest Waive Off', href: '/application/interest/waive-off' },
        { label: 'Customer Waiver Report', href: '/application/interest/customer-waiver-report' },
        { label: 'Project Wise Grace Period', href: '/application/interest/grace-project-wise' },
        { label: 'Installment Wise Grace Period', href: '/application/interest/grace-installment-wise' },
        { label: 'Customer & Installment Wise Grace Period', href: '/application/interest/grace-customer-wise' },
      ]},
      { label: 'Documents', children: [
        { label: 'Pending Documents', href: '/application/documents/pending' },
        { label: 'Uploaded Documents', href: '/application/documents/uploaded' },
        { label: 'Document Dispatch Register', href: '/application/documents/dispatch-register' },
        { label: 'Customer Document Dispatch Multiple', href: '/application/documents/dispatch-multiple' },
        { label: 'Dispatch Report', href: '/application/documents/dispatch-report' },
        { label: 'Printed Document Dispatch', href: '/application/documents/printed-dispatch' },
        { label: 'Printed Document', href: '/application/documents/printed' },
        { label: 'Pending KYC in Booking Form', href: '/application/documents/pending-kyc' },
      ]},
      { label: 'Loan Process', children: [
        { label: 'Finance Detail', href: '/application/loan' },
        { label: 'Loan Dispersal Report', href: '/application/loan/dispersal-report' },
      ]},
      { label: 'Surrender/Cancellation', children: [
        { label: 'Application', href: '/application/surrender/apply' },
        { label: 'Surrender/Cancellation Report', href: '/application/surrender/report' },
        { label: 'Surrender/Cancellation Restore', href: '/application/surrender/restore' },
      ]},
      { label: 'Transfer', children: [
        { label: 'Transfer Fee Setup', href: '/application/transfer/setup-fee' },
        { label: 'Service Tax Master', href: '/application/transfer/setup-tax' },
        { label: 'Transfer Application', href: '/application/transfer/apply' },
        { label: 'Transfer Report', href: '/application/transfer/report' },
        { label: 'Transfer Detail', href: '/application/transfer/detail' },
        { label: 'Transfer After Registry', href: '/application/transfer/after-registry' },
      ]},
    ],
  },
  {
    label: 'Reports', icon: '📊',
    items: [
      { label: 'Inventory', children: [
        { label: 'Project Details', href: '/reports/inventory/availability' },
        { label: 'Unit Status', href: '/reports/inventory/unit-status' },
        { label: 'Unit Wise PLC', href: '/reports/inventory/unit-wise-plc' },
        { label: 'Availability Sheet', href: '/reports/inventory/availability' },
        { label: 'Unit Status Tower Wise', href: '/reports/inventory/tower-wise' },
        { label: 'Unit Status Type Wise', href: '/reports/inventory/type-wise' },
        { label: 'Unit Sold', href: '/reports/inventory/unit-sold' },
        { label: 'Unit Sold/Avail Area Wise', href: '/reports/inventory/unit-sold-area-wise' },
        { label: 'Tower Wise Average Cost', href: '/reports/inventory/tower-wise-avg-cost' },
        { label: 'Unit Wise Average Cost', href: '/reports/inventory/unit-wise-avg-cost' },
        { label: 'Unit Cost', href: '/reports/inventory/unit-cost' },
      ]},
      { label: 'Applicant Detail', children: [
        { label: 'Applicant Payment File', href: '/reports/applicant/payment-file' },
        { label: 'Master Report', href: '/reports/applicant/master' },
        { label: 'Applicant History', href: '/reports/applicant/history' },
        { label: 'Applicant Birthday', href: '/reports/applicant/birthday' },
        { label: 'Search Customer', href: '/reports/applicant/search' },
        { label: 'Customer Detail', href: '/reports/applicant/customer-detail' },
        { label: 'Customer Classification', href: '/reports/applicant/classification' },
        { label: 'Date Wise Booking', href: '/reports/applicant/date-wise-booking' },
        { label: 'User Wise Booking', href: '/reports/applicant/user-wise-booking' },
        { label: 'Customer Average Cost Detail', href: '/reports/applicant/avg-cost-detail' },
        { label: 'Multiple Booking', href: '/reports/applicant/multiple-booking' },
      ]},
      { label: 'Collection', children: [
        { label: 'Project Wise Collection', href: '/reports/collection/project-wise' },
        { label: 'Collection Report', href: '/reports/collection/index' },
        { label: 'Customer Wise Collection', href: '/reports/collection/customer-wise' },
        { label: 'Charges Wise (Vertical)', href: '/reports/collection/charges-wise' },
        { label: 'Charges Wise (Horizontal)', href: '/reports/collection/tower-unit-type' },
        { label: 'Customer Wise Balance', href: '/reports/collection/customer-balance' },
        { label: 'Receipt Wise Collection', href: '/reports/collection/receipt-wise' },
        { label: 'Collection Chart Report', href: '/reports/collection/chart' },
        { label: 'Monthly Fund Expense Report', href: '/reports/collection/fund-expense' },
      ]},
      { label: 'Dues', children: [
        { label: 'Due Report', href: '/reports/dues/index' },
        { label: 'Customer Wise Dues', href: '/reports/dues/customer-wise' },
        { label: 'Tower Wise Dues', href: '/reports/dues/tower-wise-stage' },
        { label: 'Plan Wise Dues', href: '/reports/dues/plan-wise-stage' },
        { label: 'Stage Wise Details', href: '/reports/dues/stage-wise-details' },
        { label: 'Customer Wise Stage Dues', href: '/reports/dues/customer-wise-stage' },
        { label: 'Stage Wise Customer Dues', href: '/reports/dues/stage-wise-customer' },
        { label: 'Percentage Wise Dues', href: '/reports/dues/percentage-wise' },
        { label: 'Due Date Wise', href: '/reports/dues/due-date-wise' },
        { label: 'Customer Dues Detail', href: '/reports/dues/customer-detail' },
        { label: 'Project Wise Ageing', href: '/reports/dues/project-wise-ageing' },
        { label: 'Tower Wise Ageing', href: '/reports/dues/tower-wise-ageing' },
        { label: 'Installment Wise Dues Report', href: '/reports/dues/installment-wise' },
        { label: 'Plan Wise Ageing', href: '/reports/dues/plan-wise-ageing' },
        { label: 'Customer Wise Ageing', href: '/reports/dues/customer-wise-ageing' },
        { label: 'Customer Wise Ageing With STax', href: '/reports/dues/customer-ageing-stax' },
        { label: 'Customer Dues %', href: '/reports/dues/customer-percentage' },
        { label: 'Due Report With All Charges', href: '/reports/dues/with-all-charges' },
        { label: 'Project Dues Detail Stage Wise', href: '/reports/dues/project-stage-wise' },
      ]},
      { label: 'Sales Reports', children: [
        { label: 'Cumulative Sales', href: '/reports/sales/cumulative' },
        { label: 'Tower Wise Sales Collection', href: '/reports/sales/tower-wise-collection' },
        { label: 'Tower Floor Sales', href: '/reports/sales/tower-floor' },
        { label: 'Broker Tower Wise Detail', href: '/reports/sales/broker-tower-wise' },
        { label: 'Broker Floor Wise Detail', href: '/reports/sales/broker-floor-wise' },
        { label: 'Project Summary', href: '/reports/sales/project-summary' },
        { label: 'Tower Wise Charge Summary', href: '/reports/sales/tower-charge-summary' },
        { label: 'Customer Mismatch', href: '/reports/sales/customer-mismatch' },
        { label: 'Booking Record Report', href: '/reports/sales/booking-record' },
      ]},
      { label: 'Financial Details', children: [
        { label: 'Bank Ledger', href: '/reports/financial/bank-ledger' },
        { label: 'Unit Type Wise Unit Status', href: '/reports/financial/unit-type-wise' },
        { label: 'Bank Wise Balance', href: '/reports/financial/bank-balance' },
      ]},
      { label: 'Charge Detail', children: [
        { label: 'Other Charge', href: '/reports/charges/other-charge' },
        { label: 'Parking Report', href: '/reports/charges/parking' },
        { label: 'IFMS', href: '/reports/charges/ifms' },
        { label: 'PLC', href: '/reports/charges/plc' },
        { label: 'Extra Charge Report', href: '/reports/charges/extra-charge' },
        { label: 'Customer PLC Report', href: '/reports/charges/customer-plc' },
        { label: 'Customer Alteration Report', href: '/reports/charges/alteration' },
        { label: 'Extra Addon Report', href: '/reports/charges/extra-addon' },
      ]},
      { label: 'MIS', children: [
        { label: 'Company Wise Stock Report', href: '/reports/mis/company-wise' },
        { label: 'Project Wise Summary', href: '/reports/mis/project-wise' },
        { label: 'Company Wise Summary', href: '/reports/mis/company-wise-summary' },
      ]},
      { label: 'Service Tax', children: [
        { label: 'DateWise Demand Raise', href: '/reports/service-tax/due-datewise-demand' },
        { label: 'Date Wise Demand With Head', href: '/reports/service-tax/due-datewise-head' },
        { label: 'Service Tax on Due Basis', href: '/reports/service-tax/due-basis' },
        { label: 'Invoice Wise Tax Detail', href: '/reports/service-tax/invoice-wise' },
        { label: 'Customer Due By Date', href: '/reports/service-tax/customer-due-date' },
        { label: 'Global Service Tax', href: '/reports/service-tax/global-config' },
        { label: 'Customer Wise TDS Report', href: '/reports/service-tax/tds-report' },
        { label: 'Project Wise Due (Tax)', href: '/reports/service-tax/dues-project-wise' },
        { label: 'Tower Wise Due (Tax)', href: '/reports/service-tax/dues-tower-wise' },
        { label: 'Unit Type Wise Due (Tax)', href: '/reports/service-tax/dues-unit-type-wise' },
        { label: 'Broker Wise Due (Tax)', href: '/reports/service-tax/dues-broker-wise' },
        { label: 'Plan Wise Due (Tax)', href: '/reports/service-tax/dues-plan-wise' },
        { label: 'Customer Wise Due (Tax)', href: '/reports/service-tax/dues-customer-wise' },
        { label: 'Receipt Head Wise Service Tax', href: '/reports/service-tax/receipt-head-wise' },
        { label: 'Head Wise Receipt & Dues', href: '/reports/service-tax/receipt-dues-head-wise' },
      ]},
    ],
  },
  {
    label: 'Broker', icon: '🤝',
    items: [
      { label: 'Broker', children: [
        { label: 'Application', href: '/broker/application' },
        { label: 'View/Edit', href: '/broker/view' },
        { label: 'Broker Project Mapping', href: '/broker/project-mapping' },
        { label: 'Sub Broker Mapping', href: '/broker/sub-broker' },
        { label: 'Address Label', href: '/broker/address-label' },
      ]},
      { label: 'Broker Setup', children: [
        { label: 'Broker TDS Master', href: '/broker/setup/tds-master' },
        { label: 'Broker Service Tax Master', href: '/broker/setup/service-tax' },
      ]},
      { label: 'Broker Report', children: [
        { label: 'Summary', href: '/broker/reports/summary' },
        { label: 'Summary Sold-Unit', href: '/broker/reports/sold-units' },
        { label: 'Broker Dues', href: '/broker/reports/booking' },
        { label: 'Broker Wise Booking', href: '/broker/reports/booking' },
        { label: 'Broker Hierarchy', href: '/broker/reports/hierarchy' },
      ]},
      { label: 'Investor/Hold', children: [
        { label: 'Hold Unit', href: '/broker/hold/hold' },
        { label: 'Unhold Unit', href: '/broker/hold/unhold' },
        { label: 'Broker Wise Hold', href: '/broker/hold/broker-wise-hold' },
      ]},
    ],
  },
  {
    label: 'Email / SMS', icon: '📨',
    items: [
      { label: 'Email', children: [
        { label: 'Subject Master', href: '/communication/email/setup' },
        { label: 'Email Setup', href: '/communication/email/setup' },
        { label: 'Email Head Master', href: '/communication/email/head-master' },
        { label: 'Email Test', href: '/communication/email/test' },
        { label: 'Email Configuration Test', href: '/communication/email/config-test' },
        { label: 'Email History', href: '/communication/email/history' },
      ]},
      { label: 'SMS', children: [
        { label: 'Setup SMS', href: '/communication/sms/setup' },
        { label: 'SMS Subject Master', href: '/communication/sms/subject-master' },
        { label: 'SMS Head Master', href: '/communication/sms/head-master' },
        { label: 'Short Code Details', href: '/communication/sms/short-code' },
        { label: 'SMS Tracker Detail', href: '/communication/sms/tracker' },
      ]},
      { label: 'Email/SMS', href: '/communication/send' },
      { label: 'Address Book', children: [
        { label: 'Group', href: '/communication/address-book/groups' },
        { label: 'Address Book', href: '/communication/address-book' },
        { label: 'Import Excel Sheet', href: '/communication/address-book/import' },
        { label: 'Address Label', href: '/communication/address-book/labels' },
      ]},
    ],
  },
  {
    label: 'Possession', icon: '🏠',
    items: [
      { label: 'Possession Date', href: '/possession/possession-date' },
      { label: 'Penalty', children: [
        { label: 'Penalty Configuration', href: '/possession/penalty-config' },
        { label: 'Set Customer Wise Penalty', href: '/possession/set-customer-penalty' },
        { label: 'Penalty Report', href: '/possession/penalty-report' },
      ]},
      { label: 'Holding', children: [
        { label: 'Holding Charge Master', href: '/possession/holding-charge' },
        { label: 'Holding Charge Report', href: '/possession/holding-report' },
        { label: 'Handover', href: '/possession/handover' },
      ]},
      { label: 'Registry Report Date Wise', href: '/possession/registry' },
      { label: 'Customer Wise NOC Request', href: '/possession/noc-request' },
      { label: 'NOC Add Payment Details', href: '/possession/noc-payment-details' },
      { label: 'Registration Charges With Stamp Duty', href: '/possession/registration-charges' },
      { label: 'Customer Final Statement Master', href: '/possession/final-statement' },
    ],
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "e:/Demo Website/ERP" && npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/NavMenu.tsx
git commit -m "feat: rewrite all 7 nav modules to match live ERP menu structure"
```

---

## Task 2: Stub pages — Set Master + Set Projects

**Files to create (22 files):**

- [ ] **Step 1: Create Set Master stub pages**

Create each file with this exact pattern (replace title as shown):

`src/pages/master/employee/team-head.tsx` — title: "Set Team Head"
`src/pages/master/employee/team-head-detail.tsx` — title: "Team Head Detail"
`src/pages/master/security/ip-enable.tsx` — title: "IP Enable/Disable Security"
`src/pages/master/roles/category.tsx` — title: "Role Category Wise Page Hierarchy"
`src/pages/master/admin/customer-history.tsx` — title: "Customer History"

Each file content (replace PAGE_TITLE):
```tsx
import PageHeader from '@/components/shared/PageHeader';
export default function Page() {
  return (
    <div>
      <PageHeader title="PAGE_TITLE" />
      <div className="bg-white border rounded p-8 text-center text-gray-400 text-sm">Under Development</div>
    </div>
  );
}
```

- [ ] **Step 2: Create Set Projects stub pages**

`src/pages/projects/create/address-owner.tsx` — title: "Address Owner Master"
`src/pages/projects/create/unit-location.tsx` — title: "Unit Location Creation"
`src/pages/projects/edit/plot.tsx` — title: "Add Plot"
`src/pages/projects/edit/unit-type.tsx` — title: "Change Unit Type"
`src/pages/projects/edit/units.tsx` — title: "Change Floor Wise Unit Allocation"
`src/pages/projects/edit/plot-villa.tsx` — title: "Change No. Of Plot/Villa"
`src/pages/projects/edit/unit-address.tsx` — title: "Edit Unit Address and Location"
`src/pages/projects/edit/detach-address.tsx` — title: "Detach Unit Address"
`src/pages/projects/edit/unit-area.tsx` — title: "Change Unit Area"
`src/pages/projects/payment-plan/edit.tsx` — title: "Edit Payment Plan"
`src/pages/projects/payment-plan/view.tsx` — title: "View Payment Plan"
`src/pages/projects/rate/charges.tsx` — title: "Change Charges Rate"
`src/pages/projects/setup/automated.tsx` — title: "Automated/Manual"
`src/pages/projects/setup/customer-classification.tsx` — title: "Customer Classification"
`src/pages/projects/setup/udsl/group-assign.tsx` — title: "Group Assign"
`src/pages/projects/setup/udsl/tax-config.tsx` — title: "Tax Configuration"
`src/pages/projects/setup/udsl/construction-cost.tsx` — title: "Project Wise Construction Cost"

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/master src/pages/projects
git commit -m "feat: add stub pages for Set Master and Set Projects missing routes"
```

---

## Task 3: Stub pages — Application

**Files to create (~45 files):**

- [ ] **Step 1: Create Application booking sub-pages**

`src/pages/application/booking/unit-shift-report.tsx` — title: "Unit Shift Report"
`src/pages/application/booking/booking-status.tsx` — title: "Booking Status"
`src/pages/application/booking/editing-status.tsx` — title: "Editing Status"
`src/pages/application/booking/applicant-addition.tsx` — title: "Applicant Addition/Deletion Process"
`src/pages/application/booking/head-wise-cost.tsx` — title: "Head Wise Cost"
`src/pages/application/booking/edit-address.tsx` — title: "Edit Customer Address"

- [ ] **Step 2: Create Application agreement sub-pages**

`src/pages/application/agreement/provisional-allotment.tsx` — title: "Provisional Allotment"
`src/pages/application/agreement/allotment-status.tsx` — title: "Allotment & Agreement Status"

- [ ] **Step 3: Create Application receipt sub-pages**

`src/pages/application/receipts/duplicate.tsx` — title: "Duplicate Receipt Generation"
`src/pages/application/receipts/debit-credit.tsx` — title: "Debit/Credit"
`src/pages/application/receipts/journal-report.tsx` — title: "Journal Report"
`src/pages/application/receipts/jv-reversal.tsx` — title: "JV/Dr/Cr/Refund Reversal"
`src/pages/application/receipts/edit-head-wise.tsx` — title: "Edit Head Wise Receipt"
`src/pages/application/receipts/cancel-report.tsx` — title: "Cancel Receipt Report"
`src/pages/application/receipts/cumulative.tsx` — title: "Cumulative Receipt Book"
`src/pages/application/receipts/reset.tsx` — title: "Reset Receipt"
`src/pages/application/receipts/assign-challan.tsx` — title: "Assign Receipt Challan"
`src/pages/application/receipts/payment-delay.tsx` — title: "Payment Clear Delay Report"
`src/pages/application/receipts/penalty-report.tsx` — title: "Penalty Payment Report"

- [ ] **Step 4: Create Application print sub-pages**

`src/pages/application/print/welcome.tsx` — title: "Print Welcome"
`src/pages/application/print/installment-wise-demand.tsx` — title: "Installment Wise Demand Status"
`src/pages/application/print/demand-manually.tsx` — title: "Print Demand Manually"
`src/pages/application/print/email-notification.tsx` — title: "Email Notification"
`src/pages/application/print/agreement-bba.tsx` — title: "Agreement (BBA)"
`src/pages/application/print/tpa.tsx` — title: "TPA"
`src/pages/application/print/user-define-letters.tsx` — title: "User Define Letters"
`src/pages/application/print/address-labels.tsx` — title: "Address Labels"

- [ ] **Step 5: Create Application banking sub-pages**

`src/pages/application/banking/verify-cheque.tsx` — title: "Verify Cheque Status"
`src/pages/application/banking/change-status.tsx` — title: "Change Cheque Status"
`src/pages/application/banking/bounce-report.tsx` — title: "Clear/Bounce Cheque Report"
`src/pages/application/banking/represent.tsx` — title: "Cheque Represent"

- [ ] **Step 6: Create Application interest sub-pages**

`src/pages/application/interest/project-wise.tsx` — title: "Interest Master (Project Wise)"
`src/pages/application/interest/project-installment-wise.tsx` — title: "Installment Wise Interest (Project)"
`src/pages/application/interest/customer-wise.tsx` — title: "Customer Interest Master"
`src/pages/application/interest/customer-delete.tsx` — title: "Delete Customer Interest"
`src/pages/application/interest/customer-installment-wise.tsx` — title: "Customer Installment Wise Interest"
`src/pages/application/interest/customer-manual.tsx` — title: "Manual Interest"
`src/pages/application/interest/waive-letter.tsx` — title: "Interest Waive Off Letter"
`src/pages/application/interest/waive-off.tsx` — title: "Interest Waive Off"
`src/pages/application/interest/customer-waiver-report.tsx` — title: "Customer Waiver Report"
`src/pages/application/interest/grace-project-wise.tsx` — title: "Project Wise Grace Period"
`src/pages/application/interest/grace-installment-wise.tsx` — title: "Installment Wise Grace Period"
`src/pages/application/interest/grace-customer-wise.tsx` — title: "Customer & Installment Wise Grace Period"

- [ ] **Step 7: Create Application documents sub-pages**

`src/pages/application/documents/pending.tsx` — title: "Pending Documents"
`src/pages/application/documents/uploaded.tsx` — title: "Uploaded Documents"
`src/pages/application/documents/dispatch-register.tsx` — title: "Document Dispatch Register"
`src/pages/application/documents/dispatch-multiple.tsx` — title: "Customer Document Dispatch Multiple"
`src/pages/application/documents/dispatch-report.tsx` — title: "Dispatch Report"
`src/pages/application/documents/printed-dispatch.tsx` — title: "Printed Document Dispatch"
`src/pages/application/documents/printed.tsx` — title: "Printed Document"
`src/pages/application/documents/pending-kyc.tsx` — title: "Pending KYC in Booking Form"

- [ ] **Step 8: Create Application remaining sub-pages**

`src/pages/application/loan/dispersal-report.tsx` — title: "Loan Dispersal Report"
`src/pages/application/surrender/report.tsx` — title: "Surrender/Cancellation Report"
`src/pages/application/surrender/restore.tsx` — title: "Surrender/Cancellation Restore"
`src/pages/application/transfer/setup-fee.tsx` — title: "Transfer Fee Setup"
`src/pages/application/transfer/setup-tax.tsx` — title: "Transfer Service Tax Master"
`src/pages/application/transfer/report.tsx` — title: "Transfer Report"
`src/pages/application/transfer/detail.tsx` — title: "Transfer Detail"
`src/pages/application/transfer/after-registry.tsx` — title: "Transfer After Registry"

- [ ] **Step 9: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add src/pages/application
git commit -m "feat: add stub pages for all Application missing routes (~45 pages)"
```

---

## Task 4: Stub pages — Reports

**Files to create (~44 files):**

- [ ] **Step 1: Create Reports inventory sub-pages**

`src/pages/reports/inventory/unit-wise-plc.tsx` — title: "Unit Wise PLC"
`src/pages/reports/inventory/unit-sold-area-wise.tsx` — title: "Unit Sold/Avail Area Wise"
`src/pages/reports/inventory/tower-wise-avg-cost.tsx` — title: "Tower Wise Average Cost"
`src/pages/reports/inventory/unit-wise-avg-cost.tsx` — title: "Unit Wise Average Cost"

- [ ] **Step 2: Create Reports applicant sub-pages**

`src/pages/reports/applicant/history.tsx` — title: "Applicant History"
`src/pages/reports/applicant/classification.tsx` — title: "Customer Classification"
`src/pages/reports/applicant/date-wise-booking.tsx` — title: "Date Wise Booking"
`src/pages/reports/applicant/user-wise-booking.tsx` — title: "User Wise Booking"
`src/pages/reports/applicant/avg-cost-detail.tsx` — title: "Customer Average Cost Detail"
`src/pages/reports/applicant/multiple-booking.tsx` — title: "Multiple Booking"

- [ ] **Step 3: Create Reports collection sub-pages**

`src/pages/reports/collection/project-wise.tsx` — title: "Project Wise Collection"
`src/pages/reports/collection/receipt-wise.tsx` — title: "Receipt Wise Collection"
`src/pages/reports/collection/tower-unit-type.tsx` — title: "Tower Vs Unit Type"
`src/pages/reports/collection/chart.tsx` — title: "Collection Chart Report"
`src/pages/reports/collection/fund-expense.tsx` — title: "Monthly Fund Expense Report"

- [ ] **Step 4: Create Reports dues sub-pages**

`src/pages/reports/dues/tower-wise-stage.tsx` — title: "Tower Wise Dues"
`src/pages/reports/dues/plan-wise-stage.tsx` — title: "Plan Wise Dues"
`src/pages/reports/dues/stage-wise-details.tsx` — title: "Stage Wise Details"
`src/pages/reports/dues/customer-wise-stage.tsx` — title: "Customer Wise Stage Dues"
`src/pages/reports/dues/stage-wise-customer.tsx` — title: "Stage Wise Customer Dues"
`src/pages/reports/dues/percentage-wise.tsx` — title: "Percentage Wise Dues"
`src/pages/reports/dues/customer-detail.tsx` — title: "Customer Dues Detail"
`src/pages/reports/dues/project-wise-ageing.tsx` — title: "Project Wise Ageing"
`src/pages/reports/dues/tower-wise-ageing.tsx` — title: "Tower Wise Ageing"
`src/pages/reports/dues/installment-wise.tsx` — title: "Installment Wise Dues Report"
`src/pages/reports/dues/plan-wise-ageing.tsx` — title: "Plan Wise Ageing"
`src/pages/reports/dues/customer-wise-ageing.tsx` — title: "Customer Wise Ageing"
`src/pages/reports/dues/customer-ageing-stax.tsx` — title: "Customer Wise Ageing With STax"
`src/pages/reports/dues/customer-percentage.tsx` — title: "Customer Dues %"
`src/pages/reports/dues/with-all-charges.tsx` — title: "Due Report With All Charges"
`src/pages/reports/dues/project-stage-wise.tsx` — title: "Project Dues Detail Stage Wise"

- [ ] **Step 5: Create Reports sales sub-pages**

`src/pages/reports/sales/cumulative.tsx` — title: "Cumulative Sales"
`src/pages/reports/sales/tower-wise-collection.tsx` — title: "Tower Wise Sales Collection"
`src/pages/reports/sales/tower-floor.tsx` — title: "Tower Floor Sales"
`src/pages/reports/sales/broker-tower-wise.tsx` — title: "Broker Tower Wise Detail"
`src/pages/reports/sales/broker-floor-wise.tsx` — title: "Broker Floor Wise Detail"
`src/pages/reports/sales/tower-charge-summary.tsx` — title: "Tower Wise Charge Summary"
`src/pages/reports/sales/customer-mismatch.tsx` — title: "Customer Mismatch"

- [ ] **Step 6: Create Reports financial + charges + MIS sub-pages**

`src/pages/reports/financial/unit-type-wise.tsx` — title: "Unit Type Wise Unit Status"
`src/pages/reports/charges/extra-charge.tsx` — title: "Extra Charge Report"
`src/pages/reports/charges/customer-plc.tsx` — title: "Customer PLC Report"
`src/pages/reports/charges/alteration.tsx` — title: "Customer Alteration Report"
`src/pages/reports/charges/extra-addon.tsx` — title: "Extra Addon Report"
`src/pages/reports/mis/company-wise-summary.tsx` — title: "Company Wise Summary"

- [ ] **Step 7: Create Reports service-tax sub-pages (all new)**

`src/pages/reports/service-tax/due-datewise-demand.tsx` — title: "DateWise Demand Raise"
`src/pages/reports/service-tax/due-datewise-head.tsx` — title: "Date Wise Demand With Head"
`src/pages/reports/service-tax/due-basis.tsx` — title: "Service Tax on Due Basis"
`src/pages/reports/service-tax/invoice-wise.tsx` — title: "Invoice Wise Tax Detail"
`src/pages/reports/service-tax/customer-due-date.tsx` — title: "Customer Due By Date"
`src/pages/reports/service-tax/global-config.tsx` — title: "Global Service Tax Configuration"
`src/pages/reports/service-tax/tds-report.tsx` — title: "Customer Wise TDS Report"
`src/pages/reports/service-tax/dues-project-wise.tsx` — title: "Project Wise Due (Tax)"
`src/pages/reports/service-tax/dues-tower-wise.tsx` — title: "Tower Wise Due (Tax)"
`src/pages/reports/service-tax/dues-unit-type-wise.tsx` — title: "Unit Type Wise Due (Tax)"
`src/pages/reports/service-tax/dues-broker-wise.tsx` — title: "Broker Wise Due (Tax)"
`src/pages/reports/service-tax/dues-plan-wise.tsx` — title: "Plan Wise Due (Tax)"
`src/pages/reports/service-tax/dues-customer-wise.tsx` — title: "Customer Wise Due (Tax)"
`src/pages/reports/service-tax/receipt-head-wise.tsx` — title: "Receipt Head Wise Service Tax"
`src/pages/reports/service-tax/receipt-dues-head-wise.tsx` — title: "Head Wise Receipt & Dues"

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add src/pages/reports
git commit -m "feat: add stub pages for all Reports missing routes (~44 pages)"
```

---

## Task 5: Stub pages — Broker + Email/SMS + Possession

**Files to create (~15 files):**

- [ ] **Step 1: Create Broker stub pages**

`src/pages/broker/address-label.tsx` — title: "Broker Address Label"
`src/pages/broker/reports/hierarchy.tsx` — title: "Broker Hierarchy"
`src/pages/broker/hold/broker-wise-hold.tsx` — title: "Broker Wise Hold"

- [ ] **Step 2: Create Email/SMS stub pages**

`src/pages/communication/email/head-master.tsx` — title: "Email Head Master"
`src/pages/communication/email/config-test.tsx` — title: "Email Configuration Test"
`src/pages/communication/sms/subject-master.tsx` — title: "SMS Subject Master"
`src/pages/communication/sms/head-master.tsx` — title: "SMS Head Master"
`src/pages/communication/sms/short-code.tsx` — title: "Short Code Details"
`src/pages/communication/address-book/import.tsx` — title: "Import Excel Sheet"
`src/pages/communication/address-book/labels.tsx` — title: "Address Label"

- [ ] **Step 3: Create Possession stub pages**

`src/pages/possession/set-customer-penalty.tsx` — title: "Set Customer Wise Penalty"
`src/pages/possession/penalty-report.tsx` — title: "Penalty Report"
`src/pages/possession/holding-report.tsx` — title: "Holding Charge Report"
`src/pages/possession/noc-payment-details.tsx` — title: "NOC Add Payment Details"
`src/pages/possession/registration-charges.tsx` — title: "Registration Charges With Stamp Duty"

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/broker src/pages/communication src/pages/possession
git commit -m "feat: add stub pages for Broker, Email/SMS, and Possession missing routes"
```

---

## Task 6: Final check + push to Vercel

- [ ] **Step 1: Final TypeScript compile check**

```bash
cd "e:/Demo Website/ERP" && npx tsc --noEmit
```
Expected: zero errors.

- [ ] **Step 2: Verify git log**

```bash
git log --oneline -6
```
Expected: 5 new commits visible (tasks 1-5).

- [ ] **Step 3: Push to GitHub → triggers Vercel deploy**

```bash
git push origin main
```
Expected: Push succeeds. Check Vercel dashboard for successful build.
