---
title: Full Menu Sync + Missing Pages — All 7 Modules
date: 2026-05-17
status: approved
---

## Overview

Bring the replica ERP (Next.js 14 Pages Router) into full parity with the live ERP at divyam2009.remserp.com across all 7 navigation modules. Work is split into three phases:

- **Phase 1** — Rewrite `NavMenu.tsx` to match the live site's exact menu hierarchy
- **Phase 2** — Create ~122 stub pages for every menu item that has no matching page file
- **Phase 3** — Module-by-module: wire stub pages to real API routes and DB models (future sessions)

## Phase 1: NavMenu.tsx Full Rewrite

File: `src/components/layout/NavMenu.tsx`

The existing component supports 2 levels (Module > Item > Child). The live site has 3 levels in places. Strategy: flatten 3rd-level sub-submenus into their parent submenu, keeping all items accessible.

### Set Master
- Company Creation → `/master/company`
- Set Up (submenu): Project Type Creation, Area Type Creation, Currency Configuration, Customer Profession Configuration, Company Bank Creation, Customer Bank Creation, Loan Bank Creation, Country Master, Letter Head Format, Activity Reminders
- Employee Login Creation (submenu): Department, Employee Information, Employee Report, Set Manager, Team Master, Set Team Head, Team Head Detail, Employee Tree, Create Login, View Login
- Documents (submenu): Document Type Creation, Document Dispatch Master
- Customized Letters (submenu): Create Letter
- Security (submenu): Password/Code, Login History, IP Enable/Disable Security, Add IP Address
- Role and Menu (submenu): Role Creation, Role Wise Menus, Role Category Wise Page Hierarchy
- Administrator Role (submenu): Customer Audit Track, Receipt Locking, Customer History, Delete Customer, Delete Receipt

### Set Projects (already updated in previous session)
- Create Project (8 items), Edit Project (10 items), Payment Plan Setup (4 items), Set Rate (3 items), Project Set Up (6 items), UDSL Setup (3 items)

### Application
- Booking (submenu): Booking Form, Edit Booking Form, Shift Units, Unit Shift Report, Booking Status, Editing Status, Applicant Addition/Deletion, Head Wise Cost, Edit Customer Address, Customer Register
- Agreement of Unit (submenu): Agreement Form, Agreement Cancellation, Provisional Allotment, Allotment & Agreement Status
- Receipt Process (submenu): Receipt Generation, Duplicate Receipt Generation, Penalty Payment, Journal Entry, Debit/Credit, Journal Report, JV/Dr/Cr/Refund Reversal, Edit Receipt, Edit Head Wise Receipt, Cancel Receipt, Cancel Receipt Report, Cumulative Receipt Book, Reset Receipt, Assign Receipt Challan, Receipt Register, Payment Clear Delay Report, Penalty Payment Report
- Demand Raise (submenu): Stage Wise, Tower Wise, Customer Wise, Installment Wise, Demand Unraise
- Printing of Document (submenu): Print Welcome, Print Demand, Installment Wise Demand Status, Print Demand Manually, Email Notification, Agreement (BBA), TPA, Applicant Ledger, User Define Letters, Address Labels
- Banking (submenu): Cheque Deposit, Verify Cheque Status, Change Cheque Status, Clear/Bounce Cheque Report, Cheque Represent
- Interest Calculation (submenu): Interest Scheduler, Interest Master (Project Wise), Installment Wise Interest (Project), Customer Interest Master, Delete Interest, Customer Installment Wise Interest, Manual Interest, Interest Waive Off Letter, Interest Waive Off, Customer Waiver Report, Project Wise Grace Period, Installment Wise Grace Period, Customer & Installment Wise Grace Period
- Documents (submenu): Pending Documents, Uploaded Documents, Document Dispatch Register, Customer Document Dispatch Multiple, Dispatch Report, Printed Document Dispatch, Printed Document, Pending KYC
- Loan Process (submenu): Finance Detail, Loan Dispersal Report
- Surrender/Cancellation (submenu): Application, Surrender/Cancellation Report, Surrender/Cancellation Restore
- Transfer (submenu): Transfer Fee Setup, Service Tax Master, Transfer Application, Transfer Report, Transfer Detail, Transfer After Registry

### Reports
- Inventory (submenu): Project Details, Unit Status, Unit Wise PLC, Availability Sheet, Unit Status Tower Wise, Unit Status Type Wise, Unit Sold, Unit Sold/Avail Area Wise, Tower Wise Average Cost, Unit Wise Average Cost, Unit Cost
- Applicant Detail (submenu): Applicant Payment File, Master Report, Chart, Applicant History, Applicant Birthday, Search Customer, Customer Detail, Customer Classification, Date Wise Booking, User Wise Booking, Customer Average Cost Detail, Multiple Booking
- Collection (submenu): Project Wise Collection, Collection Report, Customer Wise Collection, Charges Wise Vertical, Charges Wise Horizontal, Customer Wise Balance, Receipt Wise Collection, Tower Vs Unit Type, Collection Chart Report, Monthly Fund Expense Report
- Dues (submenu): Due Report, Customer Wise Dues, Tower Wise Dues, Plan Wise Dues, Stage Wise Details, Customer Wise Stage Dues, Stage Wise Customer Dues, Percentage Wise Dues, Due Date Wise, Customer Dues Detail, Project Wise Ageing, Tower Wise Ageing, Installment Wise Dues Report, Plan Wise Ageing, Customer Wise Ageing, Customer Wise Ageing With STax, Customer Dues %, Due Report With All Charges, Project Dues Detail Stage Wise
- Sales Reports (submenu): Cumulative Sales, Tower Wise Sales Collection, Tower Floor Sales, Broker Tower Wise Detail, Broker Floor Wise Detail, Project Summary, Tower Wise Charge Summary, Customer Mismatch, Booking Record Report
- Financial Details (submenu): Bank Ledger, Unit Type Wise Unit Status, Bank Wise Balance
- Charge Detail (submenu): Other Charge, Parking Report, IFMS, PLC, Extra Charge Report, Customer PLC Report, Customer Alteration Report, Extra Addon Report
- MIS (submenu): Company Wise Stock Report, Project Wise Summary, Company Wise Summary
- Service Tax (submenu): DateWise Demand Raise, Date Wise Demand With Head, Service Tax on Due Basis, Invoice Wise Tax Detail, Customer Due By Date, Global Service Tax, Customer Wise TDS Report, Project Wise Due (Tax), Tower Wise Due (Tax), Unit Type Wise Due (Tax), Broker Wise Due (Tax), Plan Wise Due (Tax), Customer Wise Due (Tax), Receipt Head Wise Service Tax, Head Wise Receipt & Dues

### Broker
- Broker (submenu): Application, View/Edit, Broker Project Mapping, Sub Broker Mapping, Address Label
- Broker Setup (submenu): Broker TDS Master, Broker Service Tax Master
- Broker Report (submenu): Summary, Summary Sold-Unit, Broker Dues, Broker Wise Booking, Broker Hierarchy
- Investor/Hold (submenu): Hold Unit, Unhold Unit, Broker Wise Hold

### Email/SMS
- Email (submenu): Subject Master, Email Setup, Email Head Master, Email Test, Email Configuration Test, Email History
- SMS (submenu): Setup SMS, SMS Subject Master, SMS Head Master, Short Code Details, SMS Tracker Detail
- Email/SMS → `/communication/send`
- Address Book (submenu): Group, Address Book, Import Excel Sheet, Address Label

### Possession
- Possession Date → `/possession/possession-date`
- Penalty (submenu): Penalty Configuration, Set Customer Wise Penalty, Penalty Report
- Holding (submenu): Holding Charge Master, Holding Charge Report, Handover
- Registry Report Date Wise → `/possession/registry`
- Customer Wise NOC Request → `/possession/noc-request`
- Customer Wise NOC — Add Payment Details → `/possession/noc-payment-details`
- Registration Charges With Stamp Duty → `/possession/registration-charges`
- Customer Final Statement Master → `/possession/final-statement`

---

## Phase 2: Stub Pages

All stub pages follow this pattern:
```tsx
import PageHeader from '@/components/shared/PageHeader';
export default function PageName() {
  return (
    <div>
      <PageHeader title="Page Title" />
      <div className="bg-white border rounded p-8 text-center text-gray-400 text-sm">
        Under Development
      </div>
    </div>
  );
}
```

### New files to create (~122 pages):

**Set Master (~5)**
- `src/pages/master/employee/team-head.tsx`
- `src/pages/master/employee/team-head-detail.tsx`
- `src/pages/master/security/ip-enable.tsx`
- `src/pages/master/roles/category.tsx`
- `src/pages/master/admin/customer-history.tsx`

**Set Projects (~17)**
- `src/pages/projects/create/address-owner.tsx`
- `src/pages/projects/create/unit-location.tsx`
- `src/pages/projects/edit/plot.tsx`
- `src/pages/projects/edit/unit-type.tsx`
- `src/pages/projects/edit/units.tsx`
- `src/pages/projects/edit/plot-villa.tsx`
- `src/pages/projects/edit/unit-address.tsx`
- `src/pages/projects/edit/detach-address.tsx`
- `src/pages/projects/edit/unit-area.tsx`
- `src/pages/projects/payment-plan/edit.tsx`
- `src/pages/projects/payment-plan/view.tsx`
- `src/pages/projects/rate/charges.tsx`
- `src/pages/projects/setup/automated.tsx`
- `src/pages/projects/setup/customer-classification.tsx`
- `src/pages/projects/setup/udsl/group-assign.tsx`
- `src/pages/projects/setup/udsl/tax-config.tsx`
- `src/pages/projects/setup/udsl/construction-cost.tsx`

**Application (~45)**
- `src/pages/application/booking/unit-shift-report.tsx`
- `src/pages/application/booking/booking-status.tsx`
- `src/pages/application/booking/editing-status.tsx`
- `src/pages/application/booking/applicant-addition.tsx`
- `src/pages/application/booking/head-wise-cost.tsx`
- `src/pages/application/booking/edit-address.tsx`
- `src/pages/application/agreement/provisional-allotment.tsx`
- `src/pages/application/agreement/allotment-status.tsx`
- `src/pages/application/receipts/duplicate.tsx`
- `src/pages/application/receipts/debit-credit.tsx`
- `src/pages/application/receipts/journal-report.tsx`
- `src/pages/application/receipts/jv-reversal.tsx`
- `src/pages/application/receipts/edit-head-wise.tsx`
- `src/pages/application/receipts/cancel-report.tsx`
- `src/pages/application/receipts/cumulative.tsx`
- `src/pages/application/receipts/reset.tsx`
- `src/pages/application/receipts/assign-challan.tsx`
- `src/pages/application/receipts/payment-delay.tsx`
- `src/pages/application/receipts/penalty-report.tsx`
- `src/pages/application/print/welcome.tsx`
- `src/pages/application/print/installment-wise-demand.tsx`
- `src/pages/application/print/demand-manually.tsx`
- `src/pages/application/print/email-notification.tsx`
- `src/pages/application/print/agreement-bba.tsx`
- `src/pages/application/print/tpa.tsx`
- `src/pages/application/print/user-define-letters.tsx`
- `src/pages/application/print/address-labels.tsx`
- `src/pages/application/banking/verify-cheque.tsx`
- `src/pages/application/banking/change-status.tsx`
- `src/pages/application/banking/bounce-report.tsx`
- `src/pages/application/banking/represent.tsx`
- `src/pages/application/interest/project-wise.tsx`
- `src/pages/application/interest/project-installment-wise.tsx`
- `src/pages/application/interest/customer-wise.tsx`
- `src/pages/application/interest/customer-delete.tsx`
- `src/pages/application/interest/customer-installment-wise.tsx`
- `src/pages/application/interest/customer-manual.tsx`
- `src/pages/application/interest/waive-letter.tsx`
- `src/pages/application/interest/waive-off.tsx`
- `src/pages/application/interest/customer-waiver-report.tsx`
- `src/pages/application/interest/grace-project-wise.tsx`
- `src/pages/application/interest/grace-installment-wise.tsx`
- `src/pages/application/interest/grace-customer-wise.tsx`
- `src/pages/application/documents/pending.tsx`
- `src/pages/application/documents/uploaded.tsx`
- `src/pages/application/documents/dispatch-register.tsx`
- `src/pages/application/documents/dispatch-multiple.tsx`
- `src/pages/application/documents/dispatch-report.tsx`
- `src/pages/application/documents/printed-dispatch.tsx`
- `src/pages/application/documents/printed.tsx`
- `src/pages/application/documents/pending-kyc.tsx`
- `src/pages/application/loan/dispersal-report.tsx`
- `src/pages/application/surrender/report.tsx`
- `src/pages/application/surrender/restore.tsx`
- `src/pages/application/transfer/setup-fee.tsx`
- `src/pages/application/transfer/setup-tax.tsx`
- `src/pages/application/transfer/report.tsx`
- `src/pages/application/transfer/detail.tsx`
- `src/pages/application/transfer/after-registry.tsx`

**Reports (~40)**
- `src/pages/reports/inventory/unit-wise-plc.tsx`
- `src/pages/reports/inventory/unit-sold-area-wise.tsx`
- `src/pages/reports/inventory/tower-wise-avg-cost.tsx`
- `src/pages/reports/inventory/unit-wise-avg-cost.tsx`
- `src/pages/reports/applicant/history.tsx`
- `src/pages/reports/applicant/classification.tsx`
- `src/pages/reports/applicant/date-wise-booking.tsx`
- `src/pages/reports/applicant/user-wise-booking.tsx`
- `src/pages/reports/applicant/avg-cost-detail.tsx`
- `src/pages/reports/applicant/multiple-booking.tsx`
- `src/pages/reports/collection/project-wise.tsx`
- `src/pages/reports/collection/receipt-wise.tsx`
- `src/pages/reports/collection/tower-unit-type.tsx`
- `src/pages/reports/collection/chart.tsx`
- `src/pages/reports/collection/fund-expense.tsx`
- `src/pages/reports/dues/tower-wise-stage.tsx`
- `src/pages/reports/dues/plan-wise-stage.tsx`
- `src/pages/reports/dues/stage-wise-details.tsx`
- `src/pages/reports/dues/customer-wise-stage.tsx`
- `src/pages/reports/dues/stage-wise-customer.tsx`
- `src/pages/reports/dues/percentage-wise.tsx`
- `src/pages/reports/dues/customer-detail.tsx`
- `src/pages/reports/dues/project-wise-ageing.tsx`
- `src/pages/reports/dues/tower-wise-ageing.tsx`
- `src/pages/reports/dues/installment-wise.tsx`
- `src/pages/reports/dues/plan-wise-ageing.tsx`
- `src/pages/reports/dues/customer-wise-ageing.tsx`
- `src/pages/reports/dues/customer-ageing-stax.tsx`
- `src/pages/reports/dues/customer-percentage.tsx`
- `src/pages/reports/dues/with-all-charges.tsx`
- `src/pages/reports/dues/project-stage-wise.tsx`
- `src/pages/reports/sales/cumulative.tsx`
- `src/pages/reports/sales/tower-wise-collection.tsx`
- `src/pages/reports/sales/tower-floor.tsx`
- `src/pages/reports/sales/broker-tower-wise.tsx`
- `src/pages/reports/sales/broker-floor-wise.tsx`
- `src/pages/reports/sales/tower-charge-summary.tsx`
- `src/pages/reports/sales/customer-mismatch.tsx`
- `src/pages/reports/financial/unit-type-wise.tsx`
- `src/pages/reports/charges/extra-charge.tsx`
- `src/pages/reports/charges/customer-plc.tsx`
- `src/pages/reports/charges/alteration.tsx`
- `src/pages/reports/charges/extra-addon.tsx`
- `src/pages/reports/mis/company-wise-summary.tsx`
- `src/pages/reports/service-tax/due-datewise-demand.tsx`
- `src/pages/reports/service-tax/due-datewise-head.tsx`
- `src/pages/reports/service-tax/due-basis.tsx`
- `src/pages/reports/service-tax/invoice-wise.tsx`
- `src/pages/reports/service-tax/customer-due-date.tsx`
- `src/pages/reports/service-tax/global-config.tsx`
- `src/pages/reports/service-tax/tds-report.tsx`
- `src/pages/reports/service-tax/dues-project-wise.tsx`
- `src/pages/reports/service-tax/dues-tower-wise.tsx`
- `src/pages/reports/service-tax/dues-unit-type-wise.tsx`
- `src/pages/reports/service-tax/dues-broker-wise.tsx`
- `src/pages/reports/service-tax/dues-plan-wise.tsx`
- `src/pages/reports/service-tax/dues-customer-wise.tsx`
- `src/pages/reports/service-tax/receipt-head-wise.tsx`
- `src/pages/reports/service-tax/receipt-dues-head-wise.tsx`

**Broker (~3)**
- `src/pages/broker/address-label.tsx`
- `src/pages/broker/reports/hierarchy.tsx`
- `src/pages/broker/hold/broker-wise-hold.tsx`

**Email/SMS (~7)**
- `src/pages/communication/email/head-master.tsx`
- `src/pages/communication/email/config-test.tsx`
- `src/pages/communication/sms/subject-master.tsx`
- `src/pages/communication/sms/head-master.tsx`
- `src/pages/communication/sms/short-code.tsx`
- `src/pages/communication/address-book/import.tsx`
- `src/pages/communication/address-book/labels.tsx`

**Possession (~5)**
- `src/pages/possession/set-customer-penalty.tsx`
- `src/pages/possession/penalty-report.tsx`
- `src/pages/possession/holding-report.tsx`
- `src/pages/possession/noc-payment-details.tsx`
- `src/pages/possession/registration-charges.tsx`

---

## Phase 3: Functionality

Existing 157 pages already have working CRUD. Phase 3 = wiring stub pages to real APIs and DB models, tackled module by module in future sessions. Priority: Set Projects > Application > Reports > others.

---

## Constraints

- NavMenu type system: `NavModule > NavItem (with optional children: NavChild[])` — 2 levels max. 3rd-level live site items get flattened into their parent submenu.
- Stub pages: no backend, no API calls — just PageHeader + "Under Development" card
- TypeScript must compile clean after all changes (`npx tsc --noEmit`)
- All changes committed to main, pushed to Vercel
