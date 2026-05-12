# RealBoost ERP — Phase 2: Set Projects Module

**Goal:** Build the full Set Projects module — Projects, Towers, Floors, Units, Payment Plans, Rates, Charge Masters (PLC/Other/Addon/IFMS), GST config, and Project Configuration.

**Architecture:** Same as Phase 1. New Sequelize models synced to MySQL. API routes in `/pages/api/projects/`. UI pages in `/pages/projects/`.

**Tech Stack:** Next.js 14 Pages Router · Sequelize · MySQL · React Hook Form · TanStack React Query

---

## New Models (19 tables)

| Model | Table | Purpose |
|---|---|---|
| Project | projects | Real estate project (linked to company) |
| Tower | towers | Tower/block within a project |
| Floor | floors | Floor within a tower |
| UnitType | unit_types | Unit type master (2BHK, 3BHK, etc.) |
| Unit | units | Individual units on each floor |
| UnitLocation | unit_locations | Location name (e.g. East Facing) |
| UnitAddressOwner | unit_address_owners | Owner/address master |
| PlcCharge | plc_charges | Preferred Location Charges |
| OtherCharge | other_charges | Other charges (power backup, club, etc.) |
| AddonCharge | addon_charges | Add-on charges |
| IfmsCharge | ifms_charges | Interest Free Maintenance Charges |
| ParkingType | parking_types | Parking type (open/covered/mechanical) |
| ProjectConfiguration | project_configurations | Booking/receipt/registration number format |
| PaymentPlan | payment_plans | Payment plan per project |
| PaymentStage | payment_stages | Demand stages within a plan |
| Installment | installments | Installment schedule |
| BookingAmount | booking_amounts | Booking amount per plan |
| Rate | rates | Rate per sq.ft per unit type |
| ReminderDays | reminder_days | Demand reminder day config |

## Pages

### Create Project flow
- `/projects/create/project` — Add new project
- `/projects/create/tower` — Add towers to project  
- `/projects/create/base-floor` — Add base floor
- `/projects/create/floor` — Floor creation
- `/projects/create/unit-type` — Unit type creation
- `/projects/create/units` — Floor-wise unit allocation

### Edit Project
- `/projects/edit/project` — Edit project details
- `/projects/edit/tower` — Edit tower
- `/projects/edit/floor` — Edit floor

### Payment Plan Setup
- `/projects/payment-plan/create` — Create payment plan
- `/projects/payment-plan/stages` — Stage master
- `/projects/payment-plan/booking-amount` — Set booking amount
- `/projects/payment-plan/installment` — Create installments
- `/projects/payment-plan/reminders` — Reminder days config

### Rate
- `/projects/rate/change` — Change rate
- `/projects/rate/report` — Rate report

### Charge Masters
- `/projects/setup/other-charge` — Other charges
- `/projects/setup/plc` — PLC charges
- `/projects/setup/addon` — Addon charges
- `/projects/setup/ifms` — IFMS charges

### Project Setup
- `/projects/setup/tax` — Tax master
- `/projects/setup/gst` — GST configuration
- `/projects/setup/project-config` — Project configuration detail
