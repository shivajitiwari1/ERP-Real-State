-- ============================================================
-- RealBoost ERP — Sample Data
-- Import AFTER realboost_erp.sql
-- Includes: 2 Projects, Towers, Floors, Units, Plans,
--           5 Bookings, Receipts, Demands, Brokers
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- MASTER LOOKUPS
-- ============================================================

INSERT IGNORE INTO `currencies` (`name`, `symbol`, `exchange_rate`) VALUES
('Indian Rupee', '₹', 1.0000),
('US Dollar', '$', 83.5000);

INSERT IGNORE INTO `professions` (`name`) VALUES
('Business'),('Service'),('Professional'),('Self Employed'),
('Retired'),('NRI'),('Student'),('Homemaker');

INSERT IGNORE INTO `project_types` (`name`) VALUES
('Residential'),('Commercial'),('Mixed Use'),('Plotted Development'),('Villa');

INSERT IGNORE INTO `area_types` (`name`) VALUES
('Square Feet'),('Square Meter'),('Square Yard');

INSERT IGNORE INTO `document_types` (`name`) VALUES
('Aadhaar Card'),('PAN Card'),('Passport'),('Voter ID'),
('Driving Licence'),('Sale Agreement'),('Allotment Letter');

INSERT IGNORE INTO `countries` (`name`, `phone_code`) VALUES
('India', '+91'),('USA', '+1'),('UAE', '+971'),
('UK', '+44'),('Singapore', '+65');

INSERT IGNORE INTO `states` (`country_id`, `name`) VALUES
(1,'Uttar Pradesh'),(1,'Maharashtra'),(1,'Delhi'),
(1,'Rajasthan'),(1,'Gujarat'),(1,'Karnataka'),
(1,'Telangana'),(1,'Tamil Nadu');

INSERT IGNORE INTO `cities` (`state_id`, `name`) VALUES
(1,'Noida'),(1,'Greater Noida'),(1,'Lucknow'),(1,'Agra'),
(1,'Ghaziabad'),(2,'Mumbai'),(2,'Pune'),(2,'Nashik'),
(3,'New Delhi'),(3,'Gurgaon'),(4,'Jaipur'),(5,'Ahmedabad'),
(6,'Bangalore'),(7,'Hyderabad'),(8,'Chennai');

INSERT IGNORE INTO `banks_company` (`bank_name`, `account_no`, `ifsc`, `branch`, `city`) VALUES
('HDFC Bank', '12345678901234', 'HDFC0001234', 'Sector 18 Branch', 'Noida'),
('ICICI Bank', '98765432109876', 'ICIC0005678', 'Connaught Place Branch', 'New Delhi');

INSERT IGNORE INTO `banks_customer` (`bank_name`, `branch`, `city`) VALUES
('HDFC Bank', 'Sector 18', 'Noida'),
('ICICI Bank', 'Sector 62', 'Noida'),
('SBI', 'Sector 37', 'Noida'),
('Axis Bank', 'Greater Noida', 'Greater Noida'),
('Kotak Mahindra', 'Connaught Place', 'New Delhi'),
('Punjab National Bank', 'Hazratganj', 'Lucknow');

INSERT IGNORE INTO `banks_loan` (`bank_name`, `branch`, `contact_person`, `contact_no`) VALUES
('HDFC Bank Home Loans', 'Sector 18, Noida', 'Rajesh Kumar', '9810001234'),
('SBI Home Loans', 'Sector 62, Noida', 'Priya Sharma', '9820002345'),
('LIC Housing Finance', 'Connaught Place, Delhi', 'Amit Singh', '9830003456'),
('ICICI Home Finance', 'Greater Noida', 'Sunita Verma', '9840004567');

-- ============================================================
-- COMPANY
-- ============================================================

INSERT IGNORE INTO `companies` (
  `code`, `group_name`, `name`, `address1`, `address2`,
  `city`, `state`, `country`, `pin`, `phone`, `email`,
  `website`, `cin`, `pan_no`, `service_tax_no`, `payable_at`
) VALUES (
  'DIVYAM', 'Divyam Group', 'Divyam Developers Pvt. Ltd.',
  'Plot No. 123, Sector 18', 'Near Metro Station',
  'Noida', 'Uttar Pradesh', 'India', '201301',
  '0120-4567890', 'info@divyamdevelopers.com',
  'www.divyamdevelopers.com', 'U70100UP2010PTC123456',
  'AAAPD1234A', 'UPADV1234567SD001', 'Noida'
);

-- ============================================================
-- EMPLOYEES (additional)
-- ============================================================

INSERT IGNORE INTO `employees` (
  `code`, `salutation`, `first_name`, `last_name`,
  `department_id`, `designation`, `mobile`, `email`,
  `is_admin`, `is_transfer`, `role_type`, `is_active`
) VALUES
('EMP002', 'Mr.', 'Rajesh', 'Sharma', 1, 'Sales Manager', '9810011111', 'rajesh@divyam.com', 0, 0, 'employee', 1),
('EMP003', 'Ms.', 'Priya', 'Verma', 1, 'Sales Executive', '9820022222', 'priya@divyam.com', 0, 0, 'employee', 1),
('EMP004', 'Mr.', 'Amit', 'Gupta', 1, 'Accounts Manager', '9830033333', 'amit@divyam.com', 0, 0, 'employee', 1);

-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO `projects` (
  `company_id`, `project_type_id`, `name`, `code`,
  `address`, `city`, `state`, `country`, `pin`,
  `phone`, `email`, `description`,
  `start_date`, `possession_date`, `is_active`
) VALUES
(1, 1, 'OASIS VENETIA HEIGHTS', 'OVH',
 'Sector 70A, Near Expressway', 'Noida', 'Uttar Pradesh', 'India', '201301',
 '0120-4001234', 'ovh@divyam.com',
 'Premium residential apartments with world-class amenities',
 '2020-01-01', '2026-12-31', 1),
(1, 1, 'THE VAULT RESIDENCES', 'TVR',
 'Sector 150, Noida Expressway', 'Noida', 'Uttar Pradesh', 'India', '201310',
 '0120-4005678', 'vault@divyam.com',
 'Luxury high-rise apartments with panoramic views',
 '2021-06-01', '2027-06-30', 1);

-- ============================================================
-- UNIT TYPES
-- ============================================================

INSERT INTO `unit_types` (`project_id`, `name`, `area`, `area_type_id`) VALUES
-- OVH (project 1)
(1, '2BHK Standard', 1050.00, 1),
(1, '2BHK Premium', 1200.00, 1),
(1, '3BHK Standard', 1450.00, 1),
(1, '3BHK Premium', 1650.00, 1),
(1, '4BHK Penthouse', 2800.00, 1),
-- TVR (project 2)
(2, '2BHK', 1100.00, 1),
(2, '3BHK', 1500.00, 1),
(2, '4BHK', 2100.00, 1);

-- ============================================================
-- TOWERS
-- ============================================================

INSERT INTO `towers` (`project_id`, `name`, `code`, `total_floors`) VALUES
-- OVH Towers
(1, 'Tower A', 'TA', 25),
(1, 'Tower B', 'TB', 25),
(1, 'Tower C', 'TC', 20),
-- TVR Towers
(2, 'East Wing', 'EW', 30),
(2, 'West Wing', 'WW', 30);

-- ============================================================
-- FLOORS (Sample: Ground + 5 floors per tower)
-- ============================================================

INSERT INTO `floors` (`tower_id`, `floor_number`, `floor_name`) VALUES
-- Tower A (OVH)
(1, 0, 'Ground Floor'),(1, 1, '1st Floor'),(1, 2, '2nd Floor'),
(1, 3, '3rd Floor'),(1, 4, '4th Floor'),(1, 5, '5th Floor'),
-- Tower B (OVH)
(2, 0, 'Ground Floor'),(2, 1, '1st Floor'),(2, 2, '2nd Floor'),
(2, 3, '3rd Floor'),(2, 4, '4th Floor'),(2, 5, '5th Floor'),
-- East Wing (TVR)
(4, 1, '1st Floor'),(4, 2, '2nd Floor'),(4, 3, '3rd Floor'),
(4, 4, '4th Floor'),(4, 5, '5th Floor');

-- ============================================================
-- UNITS
-- ============================================================

-- Tower A, Ground Floor (units 1-4 = 2BHK Standard)
INSERT INTO `units` (`project_id`, `tower_id`, `floor_id`, `unit_type_id`, `unit_number`, `area`, `status`) VALUES
(1, 1, 1, 1, 'A-001', 1050.00, 'sold'),
(1, 1, 1, 1, 'A-002', 1050.00, 'booked'),
(1, 1, 1, 2, 'A-003', 1200.00, 'available'),
(1, 1, 1, 2, 'A-004', 1200.00, 'available'),
-- Tower A, 1st Floor
(1, 1, 2, 1, 'A-101', 1050.00, 'sold'),
(1, 1, 2, 1, 'A-102', 1050.00, 'booked'),
(1, 1, 2, 3, 'A-103', 1450.00, 'available'),
(1, 1, 2, 3, 'A-104', 1450.00, 'available'),
-- Tower A, 2nd Floor
(1, 1, 3, 3, 'A-201', 1450.00, 'sold'),
(1, 1, 3, 3, 'A-202', 1450.00, 'available'),
(1, 1, 3, 4, 'A-203', 1650.00, 'available'),
(1, 1, 3, 4, 'A-204', 1650.00, 'available'),
-- Tower A, 3rd Floor
(1, 1, 4, 4, 'A-301', 1650.00, 'booked'),
(1, 1, 4, 4, 'A-302', 1650.00, 'available'),
(1, 1, 4, 3, 'A-303', 1450.00, 'available'),
(1, 1, 4, 3, 'A-304', 1450.00, 'available'),
-- Tower B, 1st Floor
(1, 2, 8, 2, 'B-101', 1200.00, 'sold'),
(1, 2, 8, 2, 'B-102', 1200.00, 'available'),
(1, 2, 8, 3, 'B-103', 1450.00, 'available'),
(1, 2, 8, 4, 'B-104', 1650.00, 'available'),
-- TVR East Wing, 1st Floor
(2, 4, 13, 6, 'EW-101', 1100.00, 'sold'),
(2, 4, 13, 6, 'EW-102', 1100.00, 'booked'),
(2, 4, 13, 7, 'EW-103', 1500.00, 'available'),
(2, 4, 13, 8, 'EW-104', 2100.00, 'available'),
-- TVR East Wing, 2nd Floor
(2, 4, 14, 6, 'EW-201', 1100.00, 'available'),
(2, 4, 14, 7, 'EW-202', 1500.00, 'available'),
(2, 4, 14, 8, 'EW-203', 2100.00, 'available');

-- ============================================================
-- CHARGES
-- ============================================================

INSERT INTO `plc_charges` (`project_id`, `name`, `rate`, `charge_type`) VALUES
(1, 'East Facing', 75.00, 'per_sqft'),
(1, 'Corner Unit', 100.00, 'per_sqft'),
(1, 'Park Facing', 125.00, 'per_sqft'),
(1, 'Pool Facing', 150.00, 'per_sqft'),
(2, 'High Floor (15+)', 200.00, 'per_sqft'),
(2, 'Expressway View', 150.00, 'per_sqft');

INSERT INTO `other_charges` (`project_id`, `name`, `rate`, `charge_type`, `is_mandatory`) VALUES
(1, 'Power Backup Charges', 75000.00, 'fixed', 1),
(1, 'Club Membership', 150000.00, 'fixed', 1),
(1, 'Maintenance Security Deposit', 100000.00, 'fixed', 1),
(1, 'Fire Fighting Charges', 25.00, 'per_sqft', 1),
(2, 'Power Backup', 85000.00, 'fixed', 1),
(2, 'Club & Gym Membership', 200000.00, 'fixed', 1),
(2, 'Maintenance Deposit', 150000.00, 'fixed', 1);

INSERT INTO `ifms_charges` (`project_id`, `name`, `rate`) VALUES
(1, 'Interest Free Maintenance Security', 50.00),
(2, 'Interest Free Maintenance Security', 60.00);

INSERT INTO `addon_charges` (`project_id`, `name`, `rate`) VALUES
(1, 'Modular Kitchen', 250000.00),
(1, 'Extra Car Parking', 350000.00),
(2, 'Modular Kitchen Premium', 400000.00),
(2, 'Extra Car Parking (Covered)', 500000.00);

INSERT INTO `parking_types` (`project_id`, `name`, `total`, `rate`) VALUES
(1, 'Open Parking', 120, 0.00),
(1, 'Covered Car Parking', 142, 350000.00),
(1, 'Open Reserved Car Parking', 120, 200000.00),
(1, 'Mechanical Car Parking', 34, 450000.00),
(2, 'Covered Car Parking', 80, 500000.00),
(2, 'Open Parking', 60, 0.00);

-- ============================================================
-- RATES
-- ============================================================

INSERT INTO `rates` (`project_id`, `unit_type_id`, `rate_per_sqft`, `effective_date`) VALUES
(1, 1, 5500.00, '2020-01-01'),
(1, 2, 5800.00, '2020-01-01'),
(1, 3, 6000.00, '2020-01-01'),
(1, 4, 6500.00, '2020-01-01'),
(1, 5, 8000.00, '2020-01-01'),
(1, 1, 6200.00, '2023-01-01'),
(1, 2, 6500.00, '2023-01-01'),
(1, 3, 6800.00, '2023-01-01'),
(1, 4, 7200.00, '2023-01-01'),
(2, 6, 7500.00, '2021-06-01'),
(2, 7, 7800.00, '2021-06-01'),
(2, 8, 8500.00, '2021-06-01');

-- ============================================================
-- PAYMENT PLANS
-- ============================================================

INSERT INTO `payment_plans` (`project_id`, `name`, `plan_type`, `discount_type`, `discount_value`, `is_100_percent`, `description`) VALUES
-- OVH Plans
(1, 'Construction Linked Plan', 'construction', 'percent', 0.00, 0, 'Payment linked to construction milestones'),
(1, 'Down Payment Plan 15%', 'regular', 'percent', 15.00, 0, '15% discount on full upfront payment'),
(1, 'Subvention Scheme 20:80', 'flexi', 'percent', 0.00, 0, '20% now, 80% on possession'),
-- TVR Plans
(2, 'Construction Linked Plan', 'construction', 'percent', 0.00, 0, 'Payment linked to milestones'),
(2, 'Down Payment 10%', 'regular', 'percent', 10.00, 0, '10% discount on upfront payment');

INSERT INTO `payment_stages` (`project_id`, `plan_id`, `name`, `stage_order`) VALUES
-- OVH CLP (plan 1)
(1, 1, 'On Booking', 1),
(1, 1, 'On Commencement of Foundation', 2),
(1, 1, 'On Casting of Ground Floor Slab', 3),
(1, 1, 'On Casting of 5th Floor Slab', 4),
(1, 1, 'On Casting of 10th Floor Slab', 5),
(1, 1, 'On Casting of 15th Floor Slab', 6),
(1, 1, 'On Casting of Top Floor Slab', 7),
(1, 1, 'On Plastering', 8),
(1, 1, 'On Flooring', 9),
(1, 1, 'On Possession', 10),
-- TVR CLP (plan 4)
(2, 4, 'On Booking', 1),
(2, 4, 'On Commencement', 2),
(2, 4, 'On Ground Floor Slab', 3),
(2, 4, 'On 10th Floor Slab', 4),
(2, 4, 'On 20th Floor Slab', 5),
(2, 4, 'On Top Floor Slab', 6),
(2, 4, 'On Possession', 7);

INSERT INTO `installments` (`plan_id`, `stage_id`, `name`, `due_type`, `percentage`, `amount`) VALUES
-- OVH CLP installments (plan 1)
(1, 1, 'Booking Amount', 'on_booking', 10.00, 0.00),
(1, 2, 'Foundation Commencement', 'milestone', 10.00, 0.00),
(1, 3, 'Ground Floor Slab', 'milestone', 10.00, 0.00),
(1, 4, '5th Floor Slab', 'milestone', 10.00, 0.00),
(1, 5, '10th Floor Slab', 'milestone', 10.00, 0.00),
(1, 6, '15th Floor Slab', 'milestone', 10.00, 0.00),
(1, 7, 'Top Floor Slab', 'milestone', 10.00, 0.00),
(1, 8, 'Plastering', 'milestone', 10.00, 0.00),
(1, 9, 'Flooring', 'milestone', 10.00, 0.00),
(1, 10, 'On Possession', 'milestone', 10.00, 0.00),
-- TVR CLP (plan 4)
(4, 11, 'Booking Amount', 'on_booking', 10.00, 0.00),
(4, 12, 'Commencement', 'milestone', 15.00, 0.00),
(4, 13, 'Ground Slab', 'milestone', 15.00, 0.00),
(4, 14, '10th Floor Slab', 'milestone', 15.00, 0.00),
(4, 15, '20th Floor Slab', 'milestone', 15.00, 0.00),
(4, 16, 'Top Floor Slab', 'milestone', 15.00, 0.00),
(4, 17, 'On Possession', 'milestone', 15.00, 0.00);

INSERT INTO `booking_amounts` (`project_id`, `plan_id`, `amount`) VALUES
(1, 1, 200000.00),
(1, 2, 500000.00),
(2, 4, 300000.00);

INSERT INTO `reminder_days` (`project_id`, `r1_days`, `r2_days`, `r3_days`, `r4_days`, `termination_days`) VALUES
(1, 7, 15, 30, 45, 60),
(2, 7, 15, 30, 45, 60);

INSERT INTO `project_configurations` (`project_id`, `booking_auth_type`, `receipt_no_prefix`, `registration_no_prefix`, `transfer_auth_type`) VALUES
(1, 'auto', 'OVH-REC', 'OVH', 'manual'),
(2, 'auto', 'TVR-REC', 'TVR', 'manual');

-- ============================================================
-- BROKERS
-- ============================================================

INSERT INTO `brokers` (
  `code`, `company_name`, `first_name`, `last_name`,
  `designation`, `pan_no`, `mobile`, `email`,
  `address`, `city`, `state`, `pincode`,
  `is_gst_registered`, `is_tds_applicable`, `is_active`
) VALUES
('BRK001', 'Sharma Properties', 'Suresh', 'Sharma',
 'Director', 'ABCPS1234D', '9871001001', 'suresh@sharmaprop.com',
 'Shop 12, Sector 18 Market', 'Noida', 'Uttar Pradesh', '201301',
 1, 1, 1),
('BRK002', 'Delhi Realtors Pvt Ltd', 'Kavita', 'Malhotra',
 'MD', 'DGHKM5678F', '9871002002', 'kavita@delhirealtors.com',
 'Office 305, Connaught Place', 'New Delhi', 'Delhi', '110001',
 1, 1, 1),
('BRK003', NULL, 'Ramesh', 'Agarwal',
 'Agent', 'PQRRA9012G', '9871003003', 'ramesh.agarwal@gmail.com',
 'Flat 4B, Sector 62', 'Noida', 'Uttar Pradesh', '201309',
 0, 0, 1);

INSERT INTO `broker_project_mappings` (`broker_id`, `project_id`, `commission_rate`) VALUES
(1, 1, 2.00),(1, 2, 2.50),
(2, 1, 1.75),(2, 2, 2.00),
(3, 1, 1.50);

-- ============================================================
-- BOOKINGS
-- ============================================================

INSERT INTO `bookings` (
  `project_id`, `unit_id`, `registration_no`, `form_no`, `booking_date`,
  `plan_id`, `basic_price`, `per_sqft`,
  `inaugural_discount`, `company_discount`, `company_discount_perc`,
  `broker_discount`, `broker_id`, `employee_id`,
  `status`, `remarks`, `created_by`
) VALUES
-- Booking 1: OVH A-001 (2BHK Standard) - SOLD
(1, 1, 'OVH/001/2022', 'F-001', '2022-03-15',
 1, 6510000.00, 6200.00, 100000.00, 0.00, 0.00, 0.00, 1, 2,
 'active', 'Referral from existing customer', 1),

-- Booking 2: OVH A-002 (2BHK Standard) - BOOKED
(1, 2, 'OVH/002/2022', 'F-002', '2022-06-20',
 1, 6510000.00, 6200.00, 0.00, 50000.00, 0.77, 0.00, 2, 3,
 'active', NULL, 1),

-- Booking 3: OVH A-101 (2BHK Standard) - SOLD
(1, 5, 'OVH/003/2022', 'F-003', '2022-08-10',
 1, 6510000.00, 6200.00, 100000.00, 0.00, 0.00, 50000.00, 1, 2,
 'active', 'Corporate booking', 1),

-- Booking 4: OVH A-301 (3BHK Premium) - BOOKED
(1, 13, 'OVH/004/2023', 'F-004', '2023-01-05',
 1, 11880000.00, 7200.00, 0.00, 100000.00, 0.84, 0.00, 3, 3,
 'active', NULL, 1),

-- Booking 5: TVR EW-101 (2BHK) - SOLD
(2, 21, 'TVR/001/2022', 'F-TVR-001', '2022-11-15',
 4, 8250000.00, 7500.00, 200000.00, 0.00, 0.00, 0.00, 2, 2,
 'active', 'NRI customer from Dubai', 1),

-- Booking 6: TVR EW-102 (2BHK) - BOOKED
(2, 22, 'TVR/002/2023', 'F-TVR-002', '2023-03-20',
 4, 8250000.00, 7500.00, 0.00, 0.00, 0.00, 100000.00, 1, 3,
 'active', NULL, 1);

-- ============================================================
-- APPLICANTS
-- ============================================================

INSERT INTO `applicants` (
  `booking_id`, `applicant_type`, `salutation`, `first_name`, `middle_name`, `last_name`,
  `relation_type`, `relation_name`, `dob`, `gender`, `marital_status`, `nri_status`,
  `pan_no`, `aadhaar_no`, `email1`, `email2`,
  `profession_id`, `designation`, `company_name`
) VALUES
-- Booking 1: Amit Kumar Sharma
(1, 'primary', 'Mr.', 'Amit', 'Kumar', 'Sharma', 's_o', 'Ram Prasad Sharma', '1985-07-15', 'male', 'married', 'resident', 'ABCPS1234D', '234512349876', 'amit.sharma@gmail.com', 'amit.work@company.com', 1, 'General Manager', 'TechCorp India Pvt Ltd'),
(1, 'co', 'Mrs.', 'Sunita', NULL, 'Sharma', 'w_o', 'Amit Kumar Sharma', '1988-03-22', 'female', 'married', 'resident', 'XYZST5678F', '567823451234', 'sunita.sharma@gmail.com', NULL, 8, NULL, NULL),

-- Booking 2: Rajesh Mehta
(2, 'primary', 'Mr.', 'Rajesh', NULL, 'Mehta', 's_o', 'Mahesh Mehta', '1979-11-30', 'male', 'married', 'resident', 'DEFGM4321H', '123456789012', 'rajesh.mehta@yahoo.com', NULL, 2, 'Deputy Director', 'Government of India'),

-- Booking 3: Priya Singh (Corporate)
(3, 'primary', 'Ms.', 'Priya', 'Rajan', 'Singh', 'd_o', 'Rajan Singh', '1990-05-18', 'female', 'unmarried', 'resident', 'PQRPS9012J', '456789012345', 'priya.singh@infosys.com', NULL, 2, 'Senior Manager', 'Infosys Ltd'),

-- Booking 4: Vikram Nair
(4, 'primary', 'Mr.', 'Vikram', NULL, 'Nair', 's_o', 'Krishnan Nair', '1982-09-10', 'male', 'married', 'resident', 'KLMVN2345K', '789012345678', 'vikram.nair@gmail.com', 'vnair@mnc.com', 1, 'CEO', 'Nair Enterprises'),
(4, 'co', 'Mrs.', 'Deepa', NULL, 'Nair', 'w_o', 'Vikram Nair', '1985-02-14', 'female', 'married', 'resident', 'STUVD6789L', '901234567890', 'deepa.nair@gmail.com', NULL, 8, NULL, NULL),

-- Booking 5: Mohammed Al-Rashid (NRI)
(5, 'primary', 'Mr.', 'Mohammed', 'Abdul', 'Rashid', 's_o', 'Abdul Rashid', '1975-12-05', 'male', 'married', 'nri', 'MNOPQ7890M', '234567890123', 'mohammed.rashid@gmail.com', 'mrashid@dubaicompany.ae', 6, 'Business Owner', 'Al-Rashid Trading LLC, Dubai'),

-- Booking 6: Neha Kapoor
(6, 'primary', 'Ms.', 'Neha', NULL, 'Kapoor', 'd_o', 'Suresh Kapoor', '1992-08-25', 'female', 'unmarried', 'resident', 'TUVWK3456N', '345678901234', 'neha.kapoor@gmail.com', NULL, 3, 'Doctor', 'Max Hospital');

-- ============================================================
-- APPLICANT ADDRESSES
-- ============================================================

INSERT INTO `applicant_addresses` (
  `applicant_id`, `address_type`, `address`, `pincode`, `state_text`, `city_text`,
  `mobile1`, `mobile2`, `phone`
) VALUES
-- Amit Sharma (applicant 1) - Residential
(1, 'residential', 'House No. 45, Sector 28', '201301', 'Uttar Pradesh', 'Noida', '9810001234', '9810005678', '0120-2345678'),
-- Sunita Sharma (applicant 2)
(2, 'residential', 'House No. 45, Sector 28', '201301', 'Uttar Pradesh', 'Noida', '9810009876', NULL, NULL),
-- Rajesh Mehta (applicant 3)
(3, 'residential', 'C-12, Alaknanda', '110019', 'Delhi', 'New Delhi', '9820001234', NULL, '011-26278900'),
-- Priya Singh (applicant 4)
(4, 'residential', 'Flat 8C, Palm Springs', '201303', 'Uttar Pradesh', 'Noida', '9830001234', '9830005678', NULL),
-- Vikram Nair (applicant 5)
(5, 'residential', 'Villa 12, Nirvana Country', '122002', 'Haryana', 'Gurgaon', '9840001234', NULL, '0124-4567890'),
-- Deepa Nair (applicant 6)
(6, 'residential', 'Villa 12, Nirvana Country', '122002', 'Haryana', 'Gurgaon', '9840009876', NULL, NULL),
-- Mohammed Rashid (applicant 7) - Office (Dubai)
(7, 'office', 'Al Quoz Industrial Area 3, Dubai', '00000', 'Dubai', 'Dubai', '+971501234567', NULL, '+97143456789'),
-- Neha Kapoor (applicant 8)
(8, 'residential', 'D-87, Pamposh Enclave', '110048', 'Delhi', 'New Delhi', '9850001234', NULL, NULL);

-- ============================================================
-- RECEIPTS
-- ============================================================

INSERT INTO `receipts` (
  `booking_id`, `project_id`, `receipt_no`, `receipt_date`,
  `receipt_type`, `payment_mode`, `amount`, `penalty_amount`, `total_amount`,
  `instrument_no`, `instrument_date`, `branch`, `narration`,
  `is_cancelled`, `is_duplicate`, `created_by`
) VALUES
-- Booking 1 receipts (OVH/001/2022)
(1, 1, 'OVH-REC-0001', '2022-03-15', 'booking', 'cheque', 200000.00, 0.00, 200000.00, 'CHQ001234', '2022-03-12', 'HDFC Sector 18', 'Booking Amount', 0, 0, 1),
(1, 1, 'OVH-REC-0002', '2022-04-20', 'installment', 'neft', 651000.00, 0.00, 651000.00, 'NEFT20220420001', '2022-04-20', NULL, 'Foundation Stage - 10%', 0, 0, 1),
(1, 1, 'OVH-REC-0003', '2022-09-15', 'installment', 'cheque', 651000.00, 0.00, 651000.00, 'CHQ005678', '2022-09-12', 'ICICI Connaught Place', 'Ground Floor Slab - 10%', 0, 0, 1),
(1, 1, 'OVH-REC-0004', '2023-02-10', 'installment', 'rtgs', 651000.00, 0.00, 651000.00, 'RTGS20230210', '2023-02-10', NULL, '5th Floor Slab - 10%', 0, 0, 1),

-- Booking 2 receipts (OVH/002/2022)
(2, 1, 'OVH-REC-0005', '2022-06-20', 'booking', 'cheque', 200000.00, 0.00, 200000.00, 'CHQ009876', '2022-06-18', 'SBI Sector 37', 'Booking Amount', 0, 0, 1),
(2, 1, 'OVH-REC-0006', '2022-09-01', 'installment', 'online', 651000.00, 0.00, 651000.00, 'ONL2022090100123', '2022-09-01', NULL, 'Foundation - 10%', 0, 0, 1),

-- Booking 3 receipts (OVH/003/2022)
(3, 1, 'OVH-REC-0007', '2022-08-10', 'booking', 'neft', 200000.00, 0.00, 200000.00, 'NEFT20220810002', '2022-08-10', NULL, 'Booking Amount', 0, 0, 1),
(3, 1, 'OVH-REC-0008', '2022-11-05', 'installment', 'rtgs', 651000.00, 0.00, 651000.00, 'RTGS20221105', '2022-11-05', NULL, 'Foundation - 10%', 0, 0, 1),
(3, 1, 'OVH-REC-0009', '2023-03-20', 'installment', 'cheque', 651000.00, 0.00, 651000.00, 'CHQ112233', '2023-03-18', 'HDFC Sector 62', 'Ground Floor Slab - 10%', 0, 0, 1),

-- Booking 5 receipts (TVR/001/2022)
(5, 2, 'TVR-REC-0001', '2022-11-15', 'booking', 'neft', 300000.00, 0.00, 300000.00, 'NEFT20221115NRI', '2022-11-15', NULL, 'Booking Amount - NRI', 0, 0, 1),
(5, 2, 'TVR-REC-0002', '2023-01-20', 'installment', 'rtgs', 825000.00, 0.00, 825000.00, 'RTGS20230120', '2023-01-20', NULL, 'Commencement - 10%', 0, 0, 1),

-- Booking 6 receipts (TVR/002/2023)
(6, 2, 'TVR-REC-0003', '2023-03-20', 'booking', 'cheque', 300000.00, 0.00, 300000.00, 'CHQ445566', '2023-03-18', 'Axis Bank GN', 'Booking Amount', 0, 0, 1);

-- ============================================================
-- CHEQUES
-- ============================================================

INSERT INTO `cheques` (
  `receipt_id`, `cheque_no`, `cheque_date`, `bank_name`, `branch`, `amount`,
  `status`, `deposit_date`, `clear_date`
) VALUES
(1, 'CHQ001234', '2022-03-12', 'HDFC Bank', 'Sector 18, Noida', 200000.00, 'cleared', '2022-03-15', '2022-03-18'),
(3, 'CHQ005678', '2022-09-12', 'ICICI Bank', 'Connaught Place', 651000.00, 'cleared', '2022-09-15', '2022-09-18'),
(5, 'CHQ009876', '2022-06-18', 'SBI', 'Sector 37, Noida', 200000.00, 'cleared', '2022-06-20', '2022-06-23'),
(7, 'CHQ002345', '2022-08-10', 'HDFC Bank', 'Sector 62, Noida', 200000.00, 'cleared', '2022-08-12', '2022-08-15'),
(9, 'CHQ112233', '2023-03-18', 'HDFC Bank', 'Sector 62, Noida', 651000.00, 'cleared', '2023-03-20', '2023-03-23'),
(11, 'CHQ445566', '2023-03-18', 'Axis Bank', 'Greater Noida', 300000.00, 'deposited', '2023-03-21', NULL);

-- ============================================================
-- DEMANDS
-- ============================================================

INSERT INTO `demands` (
  `booking_id`, `project_id`, `installment_id`, `stage_id`,
  `demand_date`, `due_date`, `amount`, `tax_amount`, `total_amount`,
  `demand_type`, `status`, `sent_date`
) VALUES
-- Booking 1 demands
(1, 1, 1, 1, '2022-03-10', '2022-03-15', 651000.00, 0.00, 651000.00, 'stage', 'settled', '2022-03-10'),
(1, 1, 2, 2, '2022-04-10', '2022-04-20', 651000.00, 0.00, 651000.00, 'stage', 'settled', '2022-04-10'),
(1, 1, 3, 3, '2022-09-01', '2022-09-15', 651000.00, 0.00, 651000.00, 'stage', 'settled', '2022-09-01'),
(1, 1, 4, 4, '2023-01-20', '2023-02-10', 651000.00, 0.00, 651000.00, 'stage', 'settled', '2023-01-20'),
(1, 1, 5, 5, '2023-07-01', '2023-07-31', 651000.00, 0.00, 651000.00, 'stage', 'sent', '2023-07-01'),
(1, 1, 6, 6, '2024-01-15', '2024-02-15', 651000.00, 0.00, 651000.00, 'stage', 'pending', NULL),

-- Booking 2 demands
(2, 1, 1, 1, '2022-06-15', '2022-06-20', 651000.00, 0.00, 651000.00, 'stage', 'settled', '2022-06-15'),
(2, 1, 2, 2, '2022-08-20', '2022-09-01', 651000.00, 0.00, 651000.00, 'stage', 'settled', '2022-08-20'),
(2, 1, 3, 3, '2023-01-10', '2023-01-31', 651000.00, 0.00, 651000.00, 'stage', 'pending', NULL),
(2, 1, 4, 4, '2023-06-01', '2023-06-30', 651000.00, 0.00, 651000.00, 'stage', 'pending', NULL),

-- Booking 4 demands (OVH A-301 3BHK Premium)
(4, 1, 1, 1, '2023-01-01', '2023-01-05', 1188000.00, 0.00, 1188000.00, 'stage', 'settled', '2023-01-01'),
(4, 1, 2, 2, '2023-04-01', '2023-04-30', 1188000.00, 0.00, 1188000.00, 'stage', 'r1', '2023-04-01'),

-- Booking 5 demands (TVR)
(5, 2, 11, 11, '2022-11-10', '2022-11-15', 825000.00, 0.00, 825000.00, 'stage', 'settled', '2022-11-10'),
(5, 2, 12, 12, '2023-01-01', '2023-01-20', 825000.00, 0.00, 825000.00, 'stage', 'settled', '2023-01-01'),
(5, 2, 13, 13, '2023-06-01', '2023-06-30', 825000.00, 0.00, 825000.00, 'stage', 'sent', '2023-06-01'),
(5, 2, 14, 14, '2024-01-01', '2024-01-31', 825000.00, 0.00, 825000.00, 'stage', 'pending', NULL),

-- Booking 6 demands (TVR)
(6, 2, 11, 11, '2023-03-15', '2023-03-20', 825000.00, 0.00, 825000.00, 'stage', 'settled', '2023-03-15');

-- ============================================================
-- AGREEMENTS
-- ============================================================

INSERT INTO `agreements` (`booking_id`, `agreement_date`, `agreement_type`, `status`, `created_by`) VALUES
(1, '2022-06-15', 'allotment', 'active', 1),
(3, '2022-11-20', 'allotment', 'active', 1),
(5, '2023-02-15', 'allotment', 'active', 1),
(1, '2023-09-01', 'bba', 'active', 1),
(5, '2024-01-10', 'bba', 'active', 1);

-- ============================================================
-- POSSESSION DATES
-- ============================================================

INSERT INTO `possession_dates` (`project_id`, `tower_id`, `booking_id`, `expected_date`, `actual_date`) VALUES
(1, 1, 1, '2026-12-31', NULL),
(1, 1, 2, '2026-12-31', NULL),
(1, 1, 3, '2026-12-31', NULL),
(1, 1, 4, '2026-12-31', NULL),
(2, 4, 5, '2027-06-30', NULL),
(2, 4, 6, '2027-06-30', NULL);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SUMMARY
-- ============================================================
-- Companies: 1 (Divyam Developers)
-- Projects: 2 (OVH + TVR)
-- Towers: 5 | Floors: 17 | Units: 26
-- Unit Types: 8 | Payment Plans: 5 | Stages: 17 | Installments: 17
-- Bookings: 6 | Applicants: 8 | Receipts: 12 | Cheques: 6
-- Demands: 17 | Agreements: 5 | Brokers: 3
-- ============================================================
