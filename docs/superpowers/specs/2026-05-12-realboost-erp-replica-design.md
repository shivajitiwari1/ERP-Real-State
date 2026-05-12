# RealBoost ERP Replica — Design Spec
**Date:** 2026-05-12  
**Source:** divyam2009.remserp.com (RealBoost by 4QT — Real Estate Manager v5.0.0)  
**Stack:** Next.js 14 (Pages Router) · MySQL · Sequelize ORM · NextAuth.js · Tailwind CSS · shadcn/ui

---

## 1. Project Overview

A full replica of the RealBoost Real Estate ERP system. The system manages real estate projects from unit inventory through customer booking, payment collection, demand generation, broker management, email/SMS communication, and final possession handover.

**Two live projects on the source ERP:** OASIS VENETIA HEIGHTS, VAULT  
**Target:** Identical functionality, MySQL database, modern Next.js stack.

---

## 2. Architecture

```
Next.js 14 (Pages Router)
├── /pages/                  UI pages (React)
│   ├── index.tsx            Dashboard (Demand Status, Daily Status, Parking Detail, Forthcoming Due)
│   ├── master/              Set Master module
│   ├── projects/            Set Projects module
│   ├── application/         Booking, Receipts, Demand, Interest, Transfers
│   ├── reports/             All reports (read-only)
│   ├── broker/              Broker management
│   ├── communication/       Email / SMS
│   └── possession/          Possession, NOC, Registry
├── /pages/api/              REST API routes (all CRUD + business logic)
├── /models/                 Sequelize models (MySQL)
├── /lib/
│   ├── db.ts                Sequelize connection singleton
│   ├── auth.ts              NextAuth config
│   ├── mailer.ts            Nodemailer (config from DB)
│   ├── sms.ts               SMS gateway (config from DB)
│   └── pdf.ts               Puppeteer PDF generation
├── /components/
│   ├── layout/              Sidebar, topbar, nav matching original ERP
│   ├── ui/                  shadcn/ui base components
│   └── shared/              DataTable, SearchBar, PrintButton, ExportCSV
└── middleware.ts             Role-based route protection (JWT session)
```

**Key libraries:**
| Purpose | Library |
|---|---|
| Auth | NextAuth.js + bcrypt |
| ORM | Sequelize + mysql2 |
| UI components | shadcn/ui + Tailwind CSS |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |
| PDF/Print | Puppeteer (server) + react-to-print (client) |
| Email | Nodemailer |
| File uploads | Multer → local/S3 |
| Date handling | dayjs |

---

## 3. Authentication & Role-Based Access Control

### Flow
1. `/login` — credentials form (username + password)
2. NextAuth Credentials Provider → validates against `users` table (bcrypt)
3. On success → JWT session includes: `{ userId, employeeId, roleId, name, allowedPages[] }`
4. `middleware.ts` — runs on every request, checks allowedPages[], redirects to `/403` or `/login`

### Role System (exact replica of source ERP)
- **roles** — Admin, Sales, Accounts, custom roles
- **role_menus** — per-role page access list
- **role_category_wise_page_hierarchy** — groups pages by category for setup UI
- Admin UI: Role Creation → Assign Menus → Create Employee Login

### Password security
- bcrypt (cost 12) for all passwords
- IP-based login restriction (configurable per user)
- Login history tracking
- Session timeout (configurable)

---

## 4. Database Schema (MySQL via Sequelize)

### Group 1 — Master (14 tables)
```sql
companies (id, code, group_name, name, address1, address2, address3, city,
           state, country, pin, phone, fax, email, website, cin,
           service_tax_no, pan_no, vat_reg_no, payable_at, logo, timestamps)

departments (id, name, timestamps)

employees (id, code, salutation, first_name, middle_name, last_name,
           department_id, designation, mobile, email, is_admin BOOL,
           is_transfer BOOL, role_type ENUM(employee,call_center),
           manager_id FK(employees), joining_date, is_active BOOL, timestamps)

users (id, employee_id FK(employees), username, password_hash,
       role_id FK(roles), is_active BOOL, last_login, timestamps)

roles (id, name, description, timestamps)

role_menus (id, role_id FK(roles), page_url, page_name,
            category, can_view BOOL, timestamps)

banks_company (id, bank_name, account_no, ifsc, branch, city, timestamps)
banks_customer (id, bank_name, branch, city, timestamps)
banks_loan (id, bank_name, branch, contact_person, contact_no, timestamps)

currencies (id, name, symbol, exchange_rate)
professions (id, name)
countries (id, name, phone_code)
states (id, country_id FK, name)
cities (id, state_id FK, name)
area_types (id, name)
project_types (id, name)
document_types (id, name)
letter_templates (id, name, content, head_format, timestamps)
```

### Group 2 — Projects (12 tables)
```sql
projects (id, company_id FK, project_type_id FK, name, code, address,
          city, state, country, pin, email, phone, start_date,
          possession_date, is_active BOOL, timestamps)

towers (id, project_id FK, name, code, total_floors, timestamps)

floors (id, tower_id FK, floor_number INT, floor_name, timestamps)

unit_types (id, project_id FK, name, area DECIMAL, area_type_id FK, timestamps)

units (id, project_id FK, tower_id FK, floor_id FK, unit_type_id FK,
       unit_number, address_id, location_id, area DECIMAL,
       status ENUM(available,booked,sold,cancelled,held), timestamps)

unit_locations (id, project_id FK, name)
unit_address_owners (id, project_id FK, owner_name, address)

plc_charges (id, project_id FK, name, rate DECIMAL,
             type ENUM(per_sqft, fixed), timestamps)
other_charges (id, project_id FK, name, rate DECIMAL,
               type ENUM(per_sqft, fixed), is_mandatory BOOL, timestamps)
addon_charges (id, project_id FK, name, rate DECIMAL, timestamps)
ifms_charges (id, project_id FK, name, rate DECIMAL, timestamps)
parking_types (id, project_id FK, name, total INT, rate DECIMAL, timestamps)

project_configurations (id, project_id FK UNIQUE, booking_auth_type,
                         receipt_no_prefix, registration_no_prefix,
                         transfer_auth_type, timestamps)
```

### Group 3 — Payment Plans (6 tables)
```sql
payment_plans (id, project_id FK, name, plan_type ENUM(flexi, regular, construction),
               discount_type ENUM(percent, per_area), discount_value DECIMAL,
               is_100_percent BOOL, description TEXT, timestamps)

payment_stages (id, project_id FK, plan_id FK, name, stage_order INT, timestamps)

installments (id, plan_id FK, stage_id FK, name,
              due_type ENUM(date, milestone, on_booking),
              due_date DATE NULL, percentage DECIMAL, amount DECIMAL, timestamps)

booking_amounts (id, project_id FK, plan_id FK, amount DECIMAL, timestamps)

rates (id, project_id FK, unit_type_id FK, rate_per_sqft DECIMAL,
       effective_date DATE, timestamps)

reminder_days (id, project_id FK, r1_days INT, r2_days INT, r3_days INT,
               r4_days INT, termination_days INT, timestamps)
```

### Group 4 — Bookings & Applicants (6 tables)
```sql
bookings (id, project_id FK, unit_id FK, registration_no VARCHAR UNIQUE,
          form_no, booking_date DATE, plan_id FK, rate_list_id FK,
          basic_price DECIMAL, per_sqft DECIMAL,
          inaugural_discount DECIMAL, company_discount DECIMAL,
          company_discount_perc DECIMAL, broker_discount DECIMAL,
          broker_id FK(brokers), team_id FK, manager_id FK(employees),
          employee_id FK(employees), corporate_id FK,
          status ENUM(active, cancelled, transferred, surrendered),
          remarks TEXT, created_by FK(users), timestamps)

applicants (id, booking_id FK, applicant_type ENUM(primary, co),
            salutation, first_name, middle_name, last_name,
            relation_type ENUM(s_o, w_o, d_o), relation_name,
            dob DATE, anniversary_date DATE,
            nri_status ENUM(resident, nri, pio),
            marital_status ENUM(married, unmarried),
            gender ENUM(male, female, other),
            no_of_children INT, passport_no, pan_no, aadhaar_no,
            email1, email2, profession_id FK, designation,
            company_name, photo VARCHAR, timestamps)

applicant_addresses (id, applicant_id FK,
                     address_type ENUM(residential, office, permanent),
                     address TEXT, pincode, country_id FK, state_id FK,
                     city_id FK, state_text, city_text,
                     mobile1, mobile2, phone_code, phone, fax)

agreements (id, booking_id FK, agreement_date DATE,
            agreement_type ENUM(provisional, allotment, bba, tpa),
            status ENUM(active, cancelled), created_by FK, timestamps)

unit_shifts (id, from_booking_id FK, to_unit_id FK,
             shift_date DATE, reason TEXT, created_by FK, timestamps)

customer_classifications (id, name, description)
```

### Group 5 — Receipts & Finance (12 tables)
```sql
receipts (id, booking_id FK, project_id FK, receipt_no VARCHAR,
          receipt_date DATE, receipt_type ENUM(installment, booking, penalty, addon),
          payment_mode ENUM(cash, cheque, online, dd, neft, rtgs),
          amount DECIMAL, penalty_amount DECIMAL, total_amount DECIMAL,
          instrument_no, instrument_date DATE, bank_id FK(banks_customer),
          branch, micr, narration TEXT, is_cancelled BOOL,
          is_duplicate BOOL, challan_no, created_by FK, timestamps)

receipt_heads (id, receipt_id FK, head_name, amount DECIMAL,
               tax_amount DECIMAL, timestamps)

demands (id, booking_id FK, project_id FK, installment_id FK,
         stage_id FK, demand_date DATE, due_date DATE,
         amount DECIMAL, tax_amount DECIMAL, total_amount DECIMAL,
         demand_type ENUM(stage, tower, customer, installment),
         status ENUM(pending, sent, r1, r2, r3, r4, termination, settled),
         sent_date DATE, timestamps)

cheques (id, receipt_id FK, cheque_no, cheque_date DATE, bank_name,
         branch, micr, amount DECIMAL,
         status ENUM(pending, deposited, cleared, bounced, represented),
         deposit_date DATE, clear_date DATE, bounce_date DATE,
         remarks TEXT, timestamps)

journal_entries (id, booking_id FK, project_id FK, entry_date DATE,
                 amount DECIMAL, entry_type ENUM(JV, DR, CR, Refund),
                 narration TEXT, created_by FK, timestamps)

interest_masters (id, project_id FK, installment_id FK, rate DECIMAL,
                  grace_days INT, calculation_type ENUM(simple, compound), timestamps)

interest_records (id, booking_id FK, installment_id FK, from_date DATE,
                  to_date DATE, principal DECIMAL, rate DECIMAL,
                  days INT, interest_amount DECIMAL,
                  is_waived BOOL, waiver_date DATE, waiver_by FK, timestamps)

grace_periods (id, project_id FK, installment_id FK NULL,
               booking_id FK NULL, grace_days INT, timestamps)

loan_details (id, booking_id FK, bank_id FK(banks_loan), branch,
              contact_person, contact_no, file_no, file_date DATE,
              employee_id FK, sanctioned_amount DECIMAL, bank_info TEXT, timestamps)

transfers (id, from_booking_id FK, to_booking_id FK, transfer_date DATE,
           transfer_fee DECIMAL, service_tax DECIMAL,
           status ENUM(pending, completed), created_by FK, timestamps)

surrenders (id, booking_id FK, surrender_date DATE, reason TEXT,
            status ENUM(surrendered, restored), restored_date DATE,
            created_by FK, timestamps)

penalties (id, booking_id FK, project_id FK, penalty_date DATE,
           amount DECIMAL, receipt_id FK NULL, timestamps)

extra_addon_charges (id, booking_id FK, addon_charge_id FK, amount DECIMAL,
                     is_cancelled BOOL, is_waived BOOL, timestamps)
```

### Group 6 — GST / Tax (6 tables)
```sql
tax_masters (id, project_id FK, name, rate DECIMAL, effective_date DATE, timestamps)
gst_config (id, project_id FK, hsn_code, gst_rate DECIMAL, cgst_rate DECIMAL,
            sgst_rate DECIMAL, igst_rate DECIMAL, effective_date DATE, timestamps)
gst_invoices (id, booking_id FK, project_id FK, invoice_no VARCHAR UNIQUE,
              invoice_date DATE, taxable_amount DECIMAL, cgst DECIMAL,
              sgst DECIMAL, igst DECIMAL, total DECIMAL,
              status ENUM(raised, reversed), timestamps)
itc_config (id, project_id FK, itc_rate DECIMAL, effective_date DATE, timestamps)
service_tax_config (id, project_id FK, rate DECIMAL, abatement DECIMAL,
                    effective_date DATE, timestamps)
tds_masters (id, broker_id FK, tds_rate DECIMAL, effective_date DATE, timestamps)
```

### Group 7 — Brokers (5 tables)
```sql
brokers (id, code, company_name TEXT, estd_year INT, salutation,
         first_name, middle_name, last_name, designation, dob DATE,
         anniversary_date DATE, pan_no, tan_no, service_tax_no,
         is_gst_registered BOOL, is_tds_applicable BOOL,
         deposit_money DECIMAL, poa_date DATE, references TEXT,
         strength_of_sales_force INT, manager_name, officer_name,
         remark TEXT, address TEXT, phone, city, mobile, state,
         email, pincode, licence_no, bank_name, bank_branch,
         account_no, ifsc, is_active BOOL, timestamps)

broker_project_mappings (id, broker_id FK, project_id FK, commission_rate DECIMAL)
sub_broker_mappings (id, broker_id FK, sub_broker_id FK, project_id FK)
broker_commissions (id, broker_id FK, booking_id FK, amount DECIMAL,
                    tds DECIMAL, net_amount DECIMAL, payment_date DATE, timestamps)
held_units (id, broker_id FK, unit_id FK, project_id FK,
            hold_date DATE, unhold_date DATE,
            status ENUM(held, released), timestamps)
```

### Group 8 — Communication (10 tables)
```sql
email_configs (id, smtp_host, smtp_port INT, username, password_encrypted,
               from_email, is_ssl BOOL, timestamps)
email_subjects (id, name, timestamps)
email_heads (id, name, subject_id FK, timestamps)
email_templates (id, name, subject_id FK, head_id FK, body TEXT, timestamps)
email_logs (id, to_email, subject, body TEXT,
            status ENUM(sent, failed), error TEXT, sent_at, timestamps)

sms_configs (id, api_url, api_key, sender_id, timestamps)
sms_subjects (id, name, timestamps)
sms_heads (id, name, subject_id FK, timestamps)
sms_templates (id, name, template_code, body TEXT, timestamps)
sms_logs (id, mobile, message TEXT, status ENUM(sent, failed), sent_at, timestamps)

address_groups (id, name, timestamps)
address_book (id, group_id FK, name, email, mobile, address TEXT, timestamps)
```

### Group 9 — Possession (8 tables)
```sql
possession_dates (id, project_id FK, tower_id FK NULL, unit_id FK NULL,
                  booking_id FK, expected_date DATE, actual_date DATE NULL, timestamps)
possession_penalties (id, project_id FK, delay_type, penalty_rate DECIMAL,
                      grace_days INT, timestamps)
customer_penalties (id, booking_id FK, penalty_config_id FK,
                    penalty_amount DECIMAL, timestamps)
holding_charges (id, project_id FK, charge_per_day DECIMAL,
                 effective_from DATE, timestamps)
holding_charge_records (id, booking_id FK, from_date DATE, to_date DATE,
                        days INT, amount DECIMAL, timestamps)
handovers (id, booking_id FK, handover_date DATE, remarks TEXT,
           created_by FK, timestamps)
noc_requests (id, booking_id FK, request_date DATE,
              status ENUM(pending, approved, rejected),
              approved_date DATE NULL, remarks TEXT, timestamps)
noc_payment_details (id, noc_request_id FK, head_name, amount DECIMAL,
                     paid_amount DECIMAL, balance DECIMAL, payment_date DATE)
registry_records (id, booking_id FK, registry_date DATE, stamp_duty DECIMAL,
                  registration_charges DECIMAL, total DECIMAL, remarks TEXT, timestamps)
final_statements (id, booking_id FK, total_cost DECIMAL, total_paid DECIMAL,
                  balance DECIMAL, generated_date DATE, timestamps)
```

**Total: ~68 tables across 9 groups**

---

## 5. Module Structure & Pages

### Module 1: Set Master (`/master/`)
| Page | URL | Description |
|---|---|---|
| Company Creation | /master/company | Create/edit company profile |
| Project Type | /master/setup/project-type | Project type lookup |
| Area Type | /master/setup/area-type | Area type lookup |
| Currency | /master/setup/currency | Currency config |
| Profession | /master/setup/profession | Customer profession lookup |
| Company Bank | /master/setup/bank/company | Company bank accounts |
| Customer Bank | /master/setup/bank/customer | Customer bank master |
| Loan Bank | /master/setup/bank/loan | Loan bank master |
| Country Master | /master/setup/country | Countries |
| Letter Head | /master/setup/letterhead | Print format setup |
| Activity Reminders | /master/setup/reminders | Reminder config |
| Employee Dept | /master/employee/department | Departments |
| Employee Info | /master/employee/info | Employee CRUD |
| Employee Report | /master/employee/report | Employee listing |
| Set Manager | /master/employee/manager | Manager assignment |
| Team Master | /master/employee/team | Teams |
| Create Login | /master/login/create | User login creation |
| View Login | /master/login/view | Login management |
| Document Type | /master/documents/type | Doc type master |
| Document Dispatch Master | /master/documents/dispatch-master | Dispatch config |
| Create Letter | /master/letters/create | Letter template builder |
| Password/Code | /master/security/password | Change password |
| Login History | /master/security/history | Login audit log |
| IP Security | /master/security/ip | IP whitelist |
| Role Creation | /master/roles/create | Role CRUD |
| Role Wise Menus | /master/roles/menus | Assign pages to role |
| Customer Audit Track | /master/admin/audit | Customer change history |
| Receipt Locking | /master/admin/receipt-lock | Lock receipts by date |
| Delete Customer | /master/admin/delete-customer | Hard delete applicant |
| Delete Receipt | /master/admin/delete-receipt | Hard delete receipt |
| Employee Tree | /master/employee/tree | Org chart (visual hierarchy) |

### Module 2: Set Projects (`/projects/`)
| Page | URL | Description |
|---|---|---|
| Add Tower/Plot | /projects/create/tower | Add towers to project |
| Add Base Floor | /projects/create/base-floor | Base floor setup |
| Floor Creation | /projects/create/floor | Floor-wise layout |
| Unit Type | /projects/create/unit-type | Unit type master |
| Floor Wise Units | /projects/create/units | Allocate units to floors |
| Pre-Attach PLC | /projects/create/pre-plc | Attach PLC charges |
| Pre-Attach Other | /projects/create/pre-other | Attach other charges |
| Edit Project | /projects/edit/project | Edit project details |
| Edit Tower | /projects/edit/tower | Edit tower |
| Edit Floor | /projects/edit/floor | Edit floor |
| Add Plot | /projects/edit/plot | Plot management |
| Change Unit Type | /projects/edit/unit-type | Change unit type |
| Payment Plan Creation | /projects/payment-plan/create | New plan |
| Stage Master | /projects/payment-plan/stages | Demand stages |
| Set Booking Amount | /projects/payment-plan/booking-amount | Booking amount |
| Create Installment | /projects/payment-plan/installment | Installment schedule |
| Reminder Days | /projects/payment-plan/reminders | Demand reminder config |
| Change Rate | /projects/rate/change | Rate change |
| Other Charge Master | /projects/setup/other-charge | Other charges |
| PLC Master | /projects/setup/plc | PLC charges |
| Addon Charges | /projects/setup/addon | Add-on charges |
| IFMS | /projects/setup/ifms | IFMS charges |
| Tax Master | /projects/setup/tax | Service tax master |
| GST Config | /projects/setup/gst | GST setup |
| Invoice Generation | /projects/setup/gst/invoice | GST invoice raise |
| UDSL Group Assign | /projects/udsl/group | UDSL group assignment |
| UDSL Tax Config | /projects/udsl/tax | UDSL tax configuration |
| UDSL Construction Cost | /projects/udsl/cost | Project wise construction cost |

### Module 3: Application (`/application/`)
| Page | URL | Description |
|---|---|---|
| Booking Form | /application/booking/new | New booking (primary + co-applicant) |
| Edit Booking | /application/booking/edit | Edit existing booking |
| Unit Shift | /application/booking/shift | Shift unit |
| Agreement Form | /application/agreement/form | Allotment/BBA |
| Agreement Cancellation | /application/agreement/cancel | Cancel agreement |
| Receipt Generation | /application/receipts/new | Generate receipt |
| Duplicate Receipt | /application/receipts/duplicate | Duplicate bill |
| Penalty Payment | /application/receipts/penalty | Penalty payment |
| Journal Entry | /application/receipts/journal | JV entry |
| Edit Receipt | /application/receipts/edit | Edit receipt |
| Cancel Receipt | /application/receipts/cancel | Cancel receipt |
| Cheque Deposit | /application/banking/deposit | Cheque deposit |
| Cheque Status | /application/banking/status | Verify cheque |
| Clear/Bounce | /application/banking/clear-bounce | Clear or bounce cheque |
| Demand Raise (Stage) | /application/demand/stage | Raise stage-wise demand |
| Demand Raise (Tower) | /application/demand/tower | Tower-wise demand |
| Demand Raise (Customer) | /application/demand/customer | Customer-wise |
| Demand Unraise | /application/demand/unraise | Reverse demand |
| Print Demand | /application/print/demand | Print demand letters |
| Agreement Print | /application/print/agreement | Print BBA/TPA |
| Applicant Ledger | /application/print/ledger | Customer ledger |
| Interest Scheduler | /application/interest/scheduler | Interest calculation |
| Interest Waiver | /application/interest/waiver | Waive off interest |
| Grace Period | /application/interest/grace | Grace period config |
| Loan Process | /application/loan | Loan details + dispersal |
| Surrender | /application/surrender/apply | Surrender application |
| Transfer | /application/transfer/apply | Unit transfer |
| Documents | /application/documents | Upload/dispatch docs |

### Module 4: Reports (`/reports/`)
- Inventory: Unit Status, Availability Sheet, Unit Sold, Tower Wise, Type Wise
- Applicant Detail: Payment File, Master Report, Birthday, Search Customer
- Collection: Project Wise, Customer Wise, Charges Wise, Monthly Fund
- Dues: Due Report, Stage Wise, Ageing MIS, Percentage Wise
- Sales Reports: Cumulative, Tower Floor, Broker Wise, Project Summary
- Financial: Bank Ledger, Bank Wise Balance
- Charge Detail: Other Charge, Parking, IFMS, PLC, Addon
- MIS: Company/Project/Tower Summary
- Service Tax / GST: Invoice Reports, Due Reports, TDS Reports

### Module 5: Broker (`/broker/`)
- Broker Application, View/Edit, Project Mapping, Sub-Broker Mapping
- TDS Master, Service Tax Master
- Reports: Summary, Sold Units, Broker Wise Booking, Hierarchy Tree
- Investor/Hold: Hold Unit, Unhold Unit, Broker Wise Hold

### Module 6: Communication (`/communication/`)
- Email: Config, Subject/Head Master, Templates, Test, History
- SMS: Config, Subject/Head Master, Templates, Tracker
- Address Book: Groups, Import Excel, Bulk Send

### Module 7: Possession (`/possession/`)
- Possession Date, Penalty Config, Customer Penalty, Penalty Report
- Holding Charge Master, Holding Charge Report, Handover
- Registry Report, NOC Requests, NOC Payment Details
- Registration Charges + Stamp Duty, Final Statement

---

## 6. Dashboard (Home Page)

Four widgets matching the original exactly:
1. **Demand Status** — per-project demand/reminder/termination counts (sent vs unsent)
2. **Daily Status** — today's sales + collection, monthly, till-date (per project)
3. **Parking Detail** — parking type × paid/free/issued/remaining (per project)
4. **Forthcoming Due** — upcoming payments: Today / 1-7 / 8-14 / 15-21 / 22-28 days

Quick Action Bar (bottom): Receipt · Application Form · Unit Status · Payment File · Dues · Search Customer · Chart Report

---

## 7. API Design

All API routes under `/pages/api/` follow this pattern:

```
GET    /api/[module]/[resource]       → list / search
POST   /api/[module]/[resource]       → create
GET    /api/[module]/[resource]/[id]  → fetch single
PUT    /api/[module]/[resource]/[id]  → update
DELETE /api/[module]/[resource]/[id]  → delete (admin only)
```

All endpoints:
- Verify JWT session (NextAuth `getServerSession`)
- Check role permission for the page
- Return `{ success, data, message, total? }` JSON

---

## 8. Key Business Logic

### Demand Generation
- Stage Wise: raise demand for all customers at a payment plan stage → creates `demands` records
- Tower Wise: filter by tower before raising
- Customer Wise: individual customer demand raise
- Demand sends email/SMS notification via configured templates

### Receipt Generation
- Select customer by project + registration no
- Load outstanding installments/demands
- Enter payment mode + amount + instrument details
- System auto-splits amount across heads (basic, PLC, other charges, GST)
- Cheque receipts go into pending → deposit → cleared/bounced flow

### Interest Calculation
- Scheduler runs project-wise or customer-wise
- Calculates daily simple/compound interest on overdue installments
- Grace period deducted before interest starts
- Admin can waive off interest with reason

### Unit Status Flow
```
available → booked (booking) → sold (agreement) → possessed (handover)
         → cancelled (cancellation/surrender)
         → held (broker hold) → available (unhold)
```

### GST Invoice
- Generated per receipt for applicable charges
- CGST + SGST (intra-state) or IGST (inter-state) based on customer state
- Invoice reversal supported
- HSN code configurable per charge type

---

## 9. Utility Tools (Login Page)

Three public tools accessible without login (matches original ERP login page):
- **Area Conversion** (`/tools/area-conversion`) — convert between sq.ft, sq.m, sq.yd, gaj, bigha, acre
- **EMI Calculator** (`/tools/emi-calculator`) — loan EMI calculation (principal, rate, tenure)
- **Check IP Address** (`/tools/my-ip`) — shows visitor's IP address

---

## 10. UI/UX Design

- **Layout:** Top navigation bar (exact 7-module menu) + breadcrumb + page content
- **Color scheme:** Match original — navy/dark blue navbar, orange accents, white content area
- **Tables:** Sortable, filterable, paginated — same column structure as original
- **Forms:** Multi-section forms (booking form has primary + co-applicant + charges + loan sections)
- **Print:** Browser print + PDF download for all documents (demands, receipts, agreements, ledgers)
- **Export:** CSV export on all report pages
- **Responsive:** Desktop-first (ERP usage pattern)

---

## 11. Non-Functional Requirements

| Concern | Approach |
|---|---|
| Security | bcrypt passwords, JWT, RBAC, input validation (Zod), SQL injection prevention via Sequelize |
| Performance | React Query caching, server-side pagination, indexed MySQL queries |
| Audit | All create/update/delete records store `created_by`, `updated_by`, `timestamps` |
| Soft deletes | Cancellations/surrenders use status flags, not hard deletes |
| File storage | Uploaded photos/documents stored in `/public/uploads/` (local disk, configurable path) |
| Print/PDF | Puppeteer generates server-side PDFs for demand letters, receipts, agreements |

---

## 12. Build Phases

| Phase | Modules | Scope |
|---|---|---|
| 1 | Set Master | Company, Employees, Roles, Auth |
| 2 | Set Projects | Projects, Towers, Floors, Units, Payment Plans, Rates |
| 3 | Application | Booking Form, Receipts, Demand Raise |
| 4 | Application | Interest, Banking, Transfers, Surrender |
| 5 | Reports | All 30+ report pages |
| 6 | Broker | Full broker module |
| 7 | Communication | Email/SMS |
| 8 | Possession | Full possession module |
| 9 | Dashboard + Print/PDF | Home dashboard + all printable documents |
