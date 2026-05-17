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
        { label: 'Pre-Attach PLC Charges', href: '/projects/create/pre-attach-plc' },
        { label: 'Pre-Attach Other Charges', href: '/projects/create/pre-attach-other' },
        { label: 'Address Owner Master', href: '/projects/create/address-owner' },
        { label: 'Unit Location Creation', href: '/projects/create/unit-location' },
      ]},
      { label: 'Edit Project', children: [
        { label: 'Edit Project', href: '/projects/edit/project' },
        { label: 'Edit Tower', href: '/projects/edit/tower' },
        { label: 'Edit Floor', href: '/projects/edit/floor' },
        { label: 'Add Plot', href: '/projects/edit/plot' },
        { label: 'Allocate Plot', href: '/projects/edit/allocate-plot' },
        { label: 'Change Unit Type', href: '/projects/edit/unit-type' },
        { label: 'Change Floor Wise Unit Allocation', href: '/projects/edit/units' },
        { label: 'Change No. Of Plot/Villa', href: '/projects/edit/plot-villa' },
        { label: 'Edit Unit Address and Location', href: '/projects/edit/unit-address' },
        { label: 'Detach Unit Address', href: '/projects/edit/detach-address' },
        { label: 'Change Unit Area - Individual Unit Wise', href: '/projects/edit/unit-area' },
      ]},
      { label: 'Payment Plan Setup', children: [
        { label: 'Payment Plan Creation', href: '/projects/payment-plan/create' },
        { label: 'Stage Master', href: '/projects/payment-plan/stages' },
        { label: 'Set Booking Amount', href: '/projects/payment-plan/booking-amount' },
        { label: 'Create Installment', href: '/projects/payment-plan/installment' },
        { label: 'Customer Wise Timely Discount', href: '/projects/payment-plan/customer-discount' },
        { label: 'Cancel Demand', href: '/projects/payment-plan/cancel-demand' },
        { label: 'Edit Installment', href: '/projects/payment-plan/edit-installment' },
        { label: 'Edit PLC Charge', href: '/projects/payment-plan/edit-plc-charge' },
        { label: 'Edit Other Charge', href: '/projects/payment-plan/edit-other-charge' },
        { label: 'Edit Personal Installment', href: '/projects/payment-plan/edit-personal' },
        { label: 'Personalise Installment', href: '/projects/payment-plan/personalise' },
        { label: 'Raised Demand Stage', href: '/projects/payment-plan/raised-demand' },
        { label: 'View Payment Plan', href: '/projects/payment-plan/view' },
        { label: 'Reminder Days Configuration', href: '/projects/payment-plan/reminders' },
        { label: 'Demand Format Customization', href: '/projects/payment-plan/demand-format' },
      ]},
      { label: 'Set Rate', children: [
        { label: 'Change Rate', href: '/projects/rate/change' },
        { label: 'Change Charges Rate', href: '/projects/rate/charges' },
        { label: 'Rate Report', href: '/projects/rate/report' },
      ]},
      { label: 'Project Set Up', children: [
        { label: 'Other Charge', href: '/projects/setup/other-charge' },
        { label: 'PLC Charges', href: '/projects/setup/plc' },
        { label: 'Extra Add On Charge Master', href: '/projects/setup/addon' },
        { label: 'Set Extra Add On Charge', href: '/projects/setup/addon-set' },
        { label: 'Set Extra Add On Charge (Bulk)', href: '/projects/setup/addon-bulk' },
        { label: 'Cancel Extra Add On Charge', href: '/projects/setup/addon-cancel' },
        { label: 'Waiveoff Add On Charge', href: '/projects/setup/addon-waiveoff' },
        { label: 'IFMS Charges', href: '/projects/setup/ifms' },
        { label: 'Tax Master', href: '/projects/setup/tax' },
        { label: 'Tax Information', href: '/projects/setup/tax-info' },
        { label: 'Tax Configuration Report', href: '/projects/setup/tax-report' },
        { label: 'Completion Certificate Master', href: '/projects/setup/completion-cert' },
        { label: 'GST Configuration', href: '/projects/setup/gst' },
        { label: 'GST Process User Rights', href: '/projects/setup/gst-rights' },
        { label: 'Invoice Generation', href: '/projects/setup/gst-invoice' },
        { label: 'Invoice Details', href: '/projects/setup/gst-invoice-details' },
        { label: 'ITC Configuration', href: '/projects/setup/gst-itc' },
        { label: 'Invoice Reversal', href: '/projects/setup/gst-reversal' },
        { label: 'HSN and Charge Wise Report', href: '/projects/setup/gst-hsn' },
        { label: 'Booking Authentication', href: '/projects/setup/booking-auth' },
        { label: 'Receipt No.', href: '/projects/setup/receipt-no' },
        { label: 'Registration No.', href: '/projects/setup/registration-no' },
        { label: 'Transfer Authentication', href: '/projects/setup/transfer-auth' },
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

/* ── Sub-item with fly-out ── */
function SubItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enter() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  }
  function leave() {
    timerRef.current = setTimeout(() => setOpen(false), 180);
  }

  if (item.href && !item.children) {
    return (
      <Link href={item.href} className="erp-dropdown-item" onClick={onClose}
        style={{ fontSize: 14, padding: '11px 18px', color: 'var(--text)', fontWeight: 500 }}>
        {item.label}
      </Link>
    );
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={enter} onMouseLeave={leave}>
      <div className="erp-dropdown-item"
        style={{ justifyContent: 'space-between', fontSize: 14, padding: '11px 18px', color: 'var(--text)', fontWeight: 600, background: open ? 'var(--row-hover)' : undefined }}>
        <span>{item.label}</span>
        <span style={{ fontSize: 13, color: '#F97316', marginLeft: 16, fontWeight: 700 }}>›</span>
      </div>
      {open && item.children && (
        <div className="erp-dropdown"
          onMouseEnter={enter}
          onMouseLeave={leave}
          style={{ position: 'absolute', left: '100%', top: 0, minWidth: 220, zIndex: 10000 }}>
          {item.children.map(child => (
            <Link key={child.href} href={child.href} className="erp-dropdown-item"
              style={{ fontSize: 14, padding: '11px 18px', color: 'var(--text)' }}
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
  const [isCompact, setIsCompact] = useState(false);
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

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const update = () => setIsCompact(media.matches);
    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  function toggle(label: string) {
    setOpen(prev => prev === label ? null : label);
  }

  const activeModule = open ? NAV.find((module) => module.label === open) : null;

  if (isCompact) {
    return (
      <nav
        ref={navRef}
        style={{ background: 'var(--bg-navbar)', borderBottom: '2px solid rgba(249,115,22,0.25)', position: 'sticky', top: 58, zIndex: 1000, transition: 'background 0.3s ease' }}
      >
        <div style={{ display: 'flex', alignItems: 'stretch', padding: '0 6px', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
          {NAV.map(module => {
            const isOpen = open === module.label;
            return (
              <button
                key={module.label}
                onClick={() => toggle(module.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '0 10px',
                  height: 42,
                  background: isOpen ? 'rgba(249,115,22,0.16)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  color: isOpen ? '#F97316' : '#E2E8F0',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  borderBottom: isOpen ? '2px solid #F97316' : '2px solid transparent',
                  letterSpacing: '0.01em',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 13 }}>{module.icon}</span>
                {module.label}
              </button>
            );
          })}
        </div>

        {activeModule && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="erp-dropdown" style={{ position: 'static', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none', boxShadow: 'none', animation: 'fadeIn 0.12s ease both' }}>
              {activeModule.items.map((item) => {
                if (item.href && !item.children) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="erp-dropdown-item"
                      onClick={() => setOpen(null)}
                      style={{ fontSize: 14, padding: '11px 14px', color: 'var(--text)', fontWeight: 500 }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label}>
                    <div className="erp-dropdown-label" style={{ padding: '8px 14px 4px' }}>{item.label}</div>
                    {item.children?.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="erp-dropdown-item"
                        onClick={() => setOpen(null)}
                        style={{ fontSize: 14, padding: '10px 14px 10px 24px', color: 'var(--text)' }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav ref={navRef}
      style={{ background: 'var(--bg-navbar)', borderBottom: '2px solid rgba(249,115,22,0.25)', position: 'sticky', top: 54, zIndex: 1000, transition: 'background 0.3s ease' }}>
      {/* overflow must NOT be hidden/auto here — it clips absolutely positioned dropdowns */}
      <div style={{ display: 'flex', alignItems: 'stretch', padding: '0 8px', overflow: 'visible' }}>
        {NAV.map(module => {
          const isOpen = open === module.label;
          return (
            <div key={module.label} style={{ position: 'relative', flexShrink: 0 }}>
              {/* Module button — click to open */}
              <button
                onClick={() => toggle(module.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0 16px', height: 50,
                  background: isOpen ? 'rgba(249,115,22,0.16)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s ease', whiteSpace: 'nowrap',
                  color: isOpen ? '#F97316' : '#E2E8F0',
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
                  borderBottom: isOpen ? '3px solid #F97316' : '3px solid transparent',
                  letterSpacing: '0.01em',
                }}>
                <span style={{ fontSize: 16 }}>{module.icon}</span>
                {module.label}
                <span style={{ fontSize: 10, opacity: 0.8, marginLeft: 1, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', display: 'inline-block' }}>▾</span>
              </button>

              {/* Dropdown panel — NO overflow:hidden here, it would clip fly-out sub-menus */}
              {isOpen && (
                <div className="erp-dropdown"
                  style={{ position: 'absolute', top: '100%', left: 0, minWidth: 230, zIndex: 9999 }}>
                  {/* No overflow on this div — overflow clips absolutely positioned fly-outs */}
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
