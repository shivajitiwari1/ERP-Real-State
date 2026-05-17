-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: realboost_erp
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addon_charges`
--

DROP TABLE IF EXISTS `addon_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addon_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `rate` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addon_charges`
--

LOCK TABLES `addon_charges` WRITE;
/*!40000 ALTER TABLE `addon_charges` DISABLE KEYS */;
INSERT INTO `addon_charges` VALUES (1,1,'Modular Kitchen',250000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,'Extra Car Parking',350000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,2,'Modular Kitchen Premium',400000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,2,'Extra Car Parking (Covered)',500000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `addon_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address_book`
--

DROP TABLE IF EXISTS `address_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address_book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address_book`
--

LOCK TABLES `address_book` WRITE;
/*!40000 ALTER TABLE `address_book` DISABLE KEYS */;
/*!40000 ALTER TABLE `address_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address_groups`
--

DROP TABLE IF EXISTS `address_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address_groups`
--

LOCK TABLES `address_groups` WRITE;
/*!40000 ALTER TABLE `address_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `address_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agreements`
--

DROP TABLE IF EXISTS `agreements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agreements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `agreement_date` date NOT NULL,
  `agreement_type` enum('provisional','allotment','bba','tpa') NOT NULL DEFAULT 'allotment',
  `status` enum('active','cancelled') NOT NULL DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agreements`
--

LOCK TABLES `agreements` WRITE;
/*!40000 ALTER TABLE `agreements` DISABLE KEYS */;
INSERT INTO `agreements` VALUES (1,1,'2022-06-15','allotment','active',1,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(2,3,'2022-11-20','allotment','active',1,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(3,5,'2023-02-15','allotment','active',1,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(4,1,'2023-09-01','bba','active',1,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(5,5,'2024-01-10','bba','active',1,'2026-05-12 18:29:17','2026-05-12 18:29:17');
/*!40000 ALTER TABLE `agreements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applicant_addresses`
--

DROP TABLE IF EXISTS `applicant_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `applicant_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `applicant_id` int(11) NOT NULL,
  `address_type` enum('residential','office','permanent') NOT NULL DEFAULT 'residential',
  `address` text DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `state_text` varchar(100) DEFAULT NULL,
  `city_text` varchar(100) DEFAULT NULL,
  `mobile1` varchar(20) DEFAULT NULL,
  `mobile2` varchar(20) DEFAULT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_applicant_id` (`applicant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicant_addresses`
--

LOCK TABLES `applicant_addresses` WRITE;
/*!40000 ALTER TABLE `applicant_addresses` DISABLE KEYS */;
INSERT INTO `applicant_addresses` VALUES (1,1,'residential','House No. 45, Sector 28','201301',NULL,NULL,NULL,'Uttar Pradesh','Noida','9810001234','9810005678',NULL,'0120-2345678',NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(2,2,'residential','House No. 45, Sector 28','201301',NULL,NULL,NULL,'Uttar Pradesh','Noida','9810009876',NULL,NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(3,3,'residential','C-12, Alaknanda','110019',NULL,NULL,NULL,'Delhi','New Delhi','9820001234',NULL,NULL,'011-26278900',NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(4,4,'residential','Flat 8C, Palm Springs','201303',NULL,NULL,NULL,'Uttar Pradesh','Noida','9830001234','9830005678',NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(5,5,'residential','Villa 12, Nirvana Country','122002',NULL,NULL,NULL,'Haryana','Gurgaon','9840001234',NULL,NULL,'0124-4567890',NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(6,6,'residential','Villa 12, Nirvana Country','122002',NULL,NULL,NULL,'Haryana','Gurgaon','9840009876',NULL,NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(7,7,'office','Al Quoz Industrial Area 3, Dubai','00000',NULL,NULL,NULL,'Dubai','Dubai','+971501234567',NULL,NULL,'+97143456789',NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(8,8,'residential','D-87, Pamposh Enclave','110048',NULL,NULL,NULL,'Delhi','New Delhi','9850001234',NULL,NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16');
/*!40000 ALTER TABLE `applicant_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applicants`
--

DROP TABLE IF EXISTS `applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `applicants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `applicant_type` enum('primary','co') NOT NULL DEFAULT 'primary',
  `salutation` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `relation_type` varchar(20) DEFAULT NULL,
  `relation_name` varchar(200) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `anniversary_date` date DEFAULT NULL,
  `nri_status` varchar(20) DEFAULT NULL,
  `marital_status` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `no_of_children` int(11) DEFAULT NULL,
  `passport_no` varchar(50) DEFAULT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `aadhaar_no` varchar(20) DEFAULT NULL,
  `email1` varchar(150) DEFAULT NULL,
  `email2` varchar(150) DEFAULT NULL,
  `profession_id` int(11) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `company_name` varchar(200) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `communication_preference` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_applicant_type` (`applicant_type`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicants`
--

LOCK TABLES `applicants` WRITE;
/*!40000 ALTER TABLE `applicants` DISABLE KEYS */;
INSERT INTO `applicants` VALUES (1,1,'primary','Mr.','Amit','Kumar','Sharma','s_o','Ram Prasad Sharma','1985-07-15',NULL,'resident','married','male',NULL,NULL,'ABCPS1234D','234512349876','amit.sharma@gmail.com','amit.work@company.com',1,'General Manager','TechCorp India Pvt Ltd',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(2,1,'co','Mrs.','Sunita',NULL,'Sharma','w_o','Amit Kumar Sharma','1988-03-22',NULL,'resident','married','female',NULL,NULL,'XYZST5678F','567823451234','sunita.sharma@gmail.com',NULL,8,NULL,NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(3,2,'primary','Mr.','Rajesh',NULL,'Mehta','s_o','Mahesh Mehta','1979-11-30',NULL,'resident','married','male',NULL,NULL,'DEFGM4321H','123456789012','rajesh.mehta@yahoo.com',NULL,2,'Deputy Director','Government of India',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(4,3,'primary','Ms.','Priya','Rajan','Singh','d_o','Rajan Singh','1990-05-18',NULL,'resident','unmarried','female',NULL,NULL,'PQRPS9012J','456789012345','priya.singh@infosys.com',NULL,2,'Senior Manager','Infosys Ltd',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(5,4,'primary','Mr.','Vikram',NULL,'Nair','s_o','Krishnan Nair','1982-09-10',NULL,'resident','married','male',NULL,NULL,'KLMVN2345K','789012345678','vikram.nair@gmail.com','vnair@mnc.com',1,'CEO','Nair Enterprises',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(6,4,'co','Mrs.','Deepa',NULL,'Nair','w_o','Vikram Nair','1985-02-14',NULL,'resident','married','female',NULL,NULL,'STUVD6789L','901234567890','deepa.nair@gmail.com',NULL,8,NULL,NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(7,5,'primary','Mr.','Mohammed','Abdul','Rashid','s_o','Abdul Rashid','1975-12-05',NULL,'nri','married','male',NULL,NULL,'MNOPQ7890M','234567890123','mohammed.rashid@gmail.com','mrashid@dubaicompany.ae',6,'Business Owner','Al-Rashid Trading LLC, Dubai',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(8,6,'primary','Ms.','Neha',NULL,'Kapoor','d_o','Suresh Kapoor','1992-08-25',NULL,'resident','unmarried','female',NULL,NULL,'TUVWK3456N','345678901234','neha.kapoor@gmail.com',NULL,3,'Doctor','Max Hospital',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16');
/*!40000 ALTER TABLE `applicants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area_types`
--

DROP TABLE IF EXISTS `area_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `area_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_types`
--

LOCK TABLES `area_types` WRITE;
/*!40000 ALTER TABLE `area_types` DISABLE KEYS */;
INSERT INTO `area_types` VALUES (1,'Square Feet','2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,'Square Meter','2026-05-12 18:29:12','2026-05-12 18:29:12'),(3,'Square Yard','2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `area_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks_company`
--

DROP TABLE IF EXISTS `banks_company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banks_company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(150) NOT NULL,
  `account_no` varchar(50) NOT NULL,
  `ifsc` varchar(20) NOT NULL,
  `branch` varchar(150) NOT NULL,
  `city` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks_company`
--

LOCK TABLES `banks_company` WRITE;
/*!40000 ALTER TABLE `banks_company` DISABLE KEYS */;
INSERT INTO `banks_company` VALUES (1,'HDFC Bank','12345678901234','HDFC0001234','Sector 18 Branch','Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,'ICICI Bank','98765432109876','ICIC0005678','Connaught Place Branch','New Delhi','2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `banks_company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks_customer`
--

DROP TABLE IF EXISTS `banks_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banks_customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(150) NOT NULL,
  `branch` varchar(150) NOT NULL,
  `city` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks_customer`
--

LOCK TABLES `banks_customer` WRITE;
/*!40000 ALTER TABLE `banks_customer` DISABLE KEYS */;
INSERT INTO `banks_customer` VALUES (1,'HDFC Bank','Sector 18','Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,'ICICI Bank','Sector 62','Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,'SBI','Sector 37','Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,'Axis Bank','Greater Noida','Greater Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(5,'Kotak Mahindra','Connaught Place','New Delhi','2026-05-12 18:29:13','2026-05-12 18:29:13'),(6,'Punjab National Bank','Hazratganj','Lucknow','2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `banks_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks_loan`
--

DROP TABLE IF EXISTS `banks_loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banks_loan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(150) NOT NULL,
  `branch` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks_loan`
--

LOCK TABLES `banks_loan` WRITE;
/*!40000 ALTER TABLE `banks_loan` DISABLE KEYS */;
INSERT INTO `banks_loan` VALUES (1,'HDFC Bank Home Loans','Sector 18, Noida','Rajesh Kumar','9810001234','2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,'SBI Home Loans','Sector 62, Noida','Priya Sharma','9820002345','2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,'LIC Housing Finance','Connaught Place, Delhi','Amit Singh','9830003456','2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,'ICICI Home Finance','Greater Noida','Sunita Verma','9840004567','2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `banks_loan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_amounts`
--

DROP TABLE IF EXISTS `booking_amounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_amounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_amounts`
--

LOCK TABLES `booking_amounts` WRITE;
/*!40000 ALTER TABLE `booking_amounts` DISABLE KEYS */;
INSERT INTO `booking_amounts` VALUES (1,1,1,200000.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(2,1,2,500000.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(3,2,4,300000.00,'2026-05-12 18:29:15','2026-05-12 18:29:15');
/*!40000 ALTER TABLE `booking_amounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `registration_no` varchar(50) NOT NULL,
  `form_no` varchar(50) DEFAULT NULL,
  `booking_date` date NOT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `rate_list_id` int(11) DEFAULT NULL,
  `basic_price` decimal(14,2) NOT NULL DEFAULT 0.00,
  `per_sqft` decimal(10,2) NOT NULL DEFAULT 0.00,
  `inaugural_discount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `company_discount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `company_discount_perc` decimal(6,2) NOT NULL DEFAULT 0.00,
  `broker_discount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `broker_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `corporate_id` int(11) DEFAULT NULL,
  `status` enum('active','cancelled','transferred','surrendered') NOT NULL DEFAULT 'active',
  `remarks` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_no` (`registration_no`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_unit_id` (`unit_id`),
  KEY `idx_status` (`status`),
  KEY `idx_booking_date` (`booking_date`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,'OVH/001/2022','F-001','2022-03-15',1,NULL,6510000.00,6200.00,100000.00,0.00,0.00,0.00,1,NULL,NULL,2,NULL,'active','Referral from existing customer',1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(2,1,2,'OVH/002/2022','F-002','2022-06-20',1,NULL,6510000.00,6200.00,0.00,50000.00,0.77,0.00,2,NULL,NULL,3,NULL,'active',NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(3,1,5,'OVH/003/2022','F-003','2022-08-10',1,NULL,6510000.00,6200.00,100000.00,0.00,0.00,50000.00,1,NULL,NULL,2,NULL,'active','Corporate booking',1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(4,1,13,'OVH/004/2023','F-004','2023-01-05',1,NULL,11880000.00,7200.00,0.00,100000.00,0.84,0.00,3,NULL,NULL,3,NULL,'active',NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(5,2,21,'TVR/001/2022','F-TVR-001','2022-11-15',4,NULL,8250000.00,7500.00,200000.00,0.00,0.00,0.00,2,NULL,NULL,2,NULL,'active','NRI customer from Dubai',1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(6,2,22,'TVR/002/2023','F-TVR-002','2023-03-20',4,NULL,8250000.00,7500.00,0.00,0.00,0.00,100000.00,1,NULL,NULL,3,NULL,'active',NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `broker_project_mappings`
--

DROP TABLE IF EXISTS `broker_project_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `broker_project_mappings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `broker_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `commission_rate` decimal(6,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_broker_id` (`broker_id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `broker_project_mappings`
--

LOCK TABLES `broker_project_mappings` WRITE;
/*!40000 ALTER TABLE `broker_project_mappings` DISABLE KEYS */;
INSERT INTO `broker_project_mappings` VALUES (1,1,1,2.00,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(2,1,2,2.50,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(3,2,1,1.75,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(4,2,2,2.00,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(5,3,1,1.50,'2026-05-12 18:29:16','2026-05-12 18:29:16');
/*!40000 ALTER TABLE `broker_project_mappings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brokers`
--

DROP TABLE IF EXISTS `brokers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brokers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `company_name` text DEFAULT NULL,
  `estd_year` int(11) DEFAULT NULL,
  `salutation` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `anniversary_date` date DEFAULT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `tan_no` varchar(20) DEFAULT NULL,
  `service_tax_no` varchar(50) DEFAULT NULL,
  `is_gst_registered` tinyint(1) NOT NULL DEFAULT 0,
  `is_tds_applicable` tinyint(1) NOT NULL DEFAULT 0,
  `deposit_money` decimal(14,2) DEFAULT NULL,
  `poa_date` date DEFAULT NULL,
  `references` text DEFAULT NULL,
  `strength_of_sales_force` int(11) DEFAULT NULL,
  `manager_name` varchar(200) DEFAULT NULL,
  `officer_name` varchar(200) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `licence_no` varchar(50) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `bank_branch` varchar(150) DEFAULT NULL,
  `account_no` varchar(50) DEFAULT NULL,
  `ifsc` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brokers`
--

LOCK TABLES `brokers` WRITE;
/*!40000 ALTER TABLE `brokers` DISABLE KEYS */;
INSERT INTO `brokers` VALUES (1,'BRK001','Sharma Properties',NULL,NULL,'Suresh',NULL,'Sharma','Director',NULL,NULL,'ABCPS1234D',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Shop 12, Sector 18 Market',NULL,'Noida','9871001001','Uttar Pradesh','suresh@sharmaprop.com','201301',NULL,NULL,NULL,NULL,NULL,1,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(2,'BRK002','Delhi Realtors Pvt Ltd',NULL,NULL,'Kavita',NULL,'Malhotra','MD',NULL,NULL,'DGHKM5678F',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Office 305, Connaught Place',NULL,'New Delhi','9871002002','Delhi','kavita@delhirealtors.com','110001',NULL,NULL,NULL,NULL,NULL,1,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(3,'BRK003',NULL,NULL,NULL,'Ramesh',NULL,'Agarwal','Agent',NULL,NULL,'PQRRA9012G',NULL,NULL,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Flat 4B, Sector 62',NULL,'Noida','9871003003','Uttar Pradesh','ramesh.agarwal@gmail.com','201309',NULL,NULL,NULL,NULL,NULL,1,'2026-05-12 18:29:15','2026-05-12 18:29:15');
/*!40000 ALTER TABLE `brokers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cheques`
--

DROP TABLE IF EXISTS `cheques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cheques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receipt_id` int(11) NOT NULL,
  `cheque_no` varchar(50) NOT NULL,
  `cheque_date` date NOT NULL,
  `bank_name` varchar(150) NOT NULL,
  `branch` varchar(150) DEFAULT NULL,
  `micr` varchar(20) DEFAULT NULL,
  `amount` decimal(14,2) NOT NULL,
  `status` enum('pending','deposited','cleared','bounced','represented') NOT NULL DEFAULT 'pending',
  `deposit_date` date DEFAULT NULL,
  `clear_date` date DEFAULT NULL,
  `bounce_date` date DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_receipt_id` (`receipt_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheques`
--

LOCK TABLES `cheques` WRITE;
/*!40000 ALTER TABLE `cheques` DISABLE KEYS */;
INSERT INTO `cheques` VALUES (1,1,'CHQ001234','2022-03-12','HDFC Bank','Sector 18, Noida',NULL,200000.00,'cleared','2022-03-15','2022-03-18',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(2,3,'CHQ005678','2022-09-12','ICICI Bank','Connaught Place',NULL,651000.00,'cleared','2022-09-15','2022-09-18',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(3,5,'CHQ009876','2022-06-18','SBI','Sector 37, Noida',NULL,200000.00,'cleared','2022-06-20','2022-06-23',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(4,7,'CHQ002345','2022-08-10','HDFC Bank','Sector 62, Noida',NULL,200000.00,'cleared','2022-08-12','2022-08-15',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(5,9,'CHQ112233','2023-03-18','HDFC Bank','Sector 62, Noida',NULL,651000.00,'cleared','2023-03-20','2023-03-23',NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(6,11,'CHQ445566','2023-03-18','Axis Bank','Greater Noida',NULL,300000.00,'deposited','2023-03-21',NULL,NULL,NULL,'2026-05-12 18:29:16','2026-05-12 18:29:16');
/*!40000 ALTER TABLE `cheques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_state_id` (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,1,'Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,1,'Greater Noida','2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,1,'Lucknow','2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,1,'Agra','2026-05-12 18:29:13','2026-05-12 18:29:13'),(5,1,'Ghaziabad','2026-05-12 18:29:13','2026-05-12 18:29:13'),(6,2,'Mumbai','2026-05-12 18:29:13','2026-05-12 18:29:13'),(7,2,'Pune','2026-05-12 18:29:13','2026-05-12 18:29:13'),(8,2,'Nashik','2026-05-12 18:29:13','2026-05-12 18:29:13'),(9,3,'New Delhi','2026-05-12 18:29:13','2026-05-12 18:29:13'),(10,3,'Gurgaon','2026-05-12 18:29:13','2026-05-12 18:29:13'),(11,4,'Jaipur','2026-05-12 18:29:13','2026-05-12 18:29:13'),(12,5,'Ahmedabad','2026-05-12 18:29:13','2026-05-12 18:29:13'),(13,6,'Bangalore','2026-05-12 18:29:13','2026-05-12 18:29:13'),(14,7,'Hyderabad','2026-05-12 18:29:13','2026-05-12 18:29:13'),(15,8,'Chennai','2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `group_name` varchar(100) NOT NULL,
  `name` varchar(200) NOT NULL,
  `address1` text NOT NULL,
  `address2` text DEFAULT NULL,
  `address3` text DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `pin` varchar(20) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `fax` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `cin` varchar(50) DEFAULT NULL,
  `service_tax_no` varchar(50) DEFAULT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `vat_reg_no` varchar(50) DEFAULT NULL,
  `payable_at` varchar(100) DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'DIVYAM','Divyam Group','Divyam Developers Pvt. Ltd.','Plot No. 123, Sector 18','Near Metro Station',NULL,'Noida','Uttar Pradesh','India','201301','0120-4567890',NULL,'info@divyamdevelopers.com','www.divyamdevelopers.com','U70100UP2010PTC123456','UPADV1234567SD001','AAAPD1234A',NULL,'Noida',NULL,'2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'India','+91','2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,'USA','+1','2026-05-12 18:29:12','2026-05-12 18:29:12'),(3,'UAE','+971','2026-05-12 18:29:12','2026-05-12 18:29:12'),(4,'UK','+44','2026-05-12 18:29:12','2026-05-12 18:29:12'),(5,'Singapore','+65','2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `exchange_rate` decimal(10,4) NOT NULL DEFAULT 1.0000,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
INSERT INTO `currencies` VALUES (1,'Indian Rupee','₹',1.0000,'2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,'US Dollar','$',83.5000,'2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demands`
--

DROP TABLE IF EXISTS `demands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `demands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `installment_id` int(11) DEFAULT NULL,
  `stage_id` int(11) DEFAULT NULL,
  `demand_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `demand_type` enum('stage','tower','customer','installment') NOT NULL DEFAULT 'stage',
  `status` enum('pending','sent','r1','r2','r3','r4','termination','settled') NOT NULL DEFAULT 'pending',
  `sent_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demands`
--

LOCK TABLES `demands` WRITE;
/*!40000 ALTER TABLE `demands` DISABLE KEYS */;
INSERT INTO `demands` VALUES (1,1,1,1,1,'2022-03-10','2022-03-15',651000.00,0.00,651000.00,'stage','settled','2022-03-10','2026-05-12 18:29:17','2026-05-12 18:29:17'),(2,1,1,2,2,'2022-04-10','2022-04-20',651000.00,0.00,651000.00,'stage','settled','2022-04-10','2026-05-12 18:29:17','2026-05-12 18:29:17'),(3,1,1,3,3,'2022-09-01','2022-09-15',651000.00,0.00,651000.00,'stage','settled','2022-09-01','2026-05-12 18:29:17','2026-05-12 18:29:17'),(4,1,1,4,4,'2023-01-20','2023-02-10',651000.00,0.00,651000.00,'stage','settled','2023-01-20','2026-05-12 18:29:17','2026-05-12 18:29:17'),(5,1,1,5,5,'2023-07-01','2023-07-31',651000.00,0.00,651000.00,'stage','sent','2023-07-01','2026-05-12 18:29:17','2026-05-12 18:29:17'),(6,1,1,6,6,'2024-01-15','2024-02-15',651000.00,0.00,651000.00,'stage','pending',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(7,2,1,1,1,'2022-06-15','2022-06-20',651000.00,0.00,651000.00,'stage','settled','2022-06-15','2026-05-12 18:29:17','2026-05-12 18:29:17'),(8,2,1,2,2,'2022-08-20','2022-09-01',651000.00,0.00,651000.00,'stage','settled','2022-08-20','2026-05-12 18:29:17','2026-05-12 18:29:17'),(9,2,1,3,3,'2023-01-10','2023-01-31',651000.00,0.00,651000.00,'stage','pending',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(10,2,1,4,4,'2023-06-01','2023-06-30',651000.00,0.00,651000.00,'stage','pending',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(11,4,1,1,1,'2023-01-01','2023-01-05',1188000.00,0.00,1188000.00,'stage','settled','2023-01-01','2026-05-12 18:29:17','2026-05-12 18:29:17'),(12,4,1,2,2,'2023-04-01','2023-04-30',1188000.00,0.00,1188000.00,'stage','r1','2023-04-01','2026-05-12 18:29:17','2026-05-12 18:29:17'),(13,5,2,11,11,'2022-11-10','2022-11-15',825000.00,0.00,825000.00,'stage','settled','2022-11-10','2026-05-12 18:29:17','2026-05-12 18:29:17'),(14,5,2,12,12,'2023-01-01','2023-01-20',825000.00,0.00,825000.00,'stage','settled','2023-01-01','2026-05-12 18:29:17','2026-05-12 18:29:17'),(15,5,2,13,13,'2023-06-01','2023-06-30',825000.00,0.00,825000.00,'stage','sent','2023-06-01','2026-05-12 18:29:17','2026-05-12 18:29:17'),(16,5,2,14,14,'2024-01-01','2024-01-31',825000.00,0.00,825000.00,'stage','pending',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(17,6,2,11,11,'2023-03-15','2023-03-20',825000.00,0.00,825000.00,'stage','settled','2023-03-15','2026-05-12 18:29:17','2026-05-12 18:29:17');
/*!40000 ALTER TABLE `demands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'IT','2026-05-12 12:36:07','2026-05-12 12:36:07');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_types`
--

DROP TABLE IF EXISTS `document_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_types`
--

LOCK TABLES `document_types` WRITE;
/*!40000 ALTER TABLE `document_types` DISABLE KEYS */;
INSERT INTO `document_types` VALUES (1,'Aadhaar Card','2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,'PAN Card','2026-05-12 18:29:12','2026-05-12 18:29:12'),(3,'Passport','2026-05-12 18:29:12','2026-05-12 18:29:12'),(4,'Voter ID','2026-05-12 18:29:12','2026-05-12 18:29:12'),(5,'Driving Licence','2026-05-12 18:29:12','2026-05-12 18:29:12'),(6,'Sale Agreement','2026-05-12 18:29:12','2026-05-12 18:29:12'),(7,'Allotment Letter','2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `document_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_configs`
--

DROP TABLE IF EXISTS `email_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `smtp_host` varchar(200) NOT NULL,
  `smtp_port` int(11) NOT NULL DEFAULT 587,
  `username` varchar(200) NOT NULL,
  `password_encrypted` text DEFAULT NULL,
  `from_email` varchar(200) NOT NULL,
  `is_ssl` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_configs`
--

LOCK TABLES `email_configs` WRITE;
/*!40000 ALTER TABLE `email_configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_email` varchar(200) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `body` longtext DEFAULT NULL,
  `status` enum('sent','failed') NOT NULL DEFAULT 'sent',
  `error` text DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_logs`
--

LOCK TABLES `email_logs` WRITE;
/*!40000 ALTER TABLE `email_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `salutation` varchar(10) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `department_id` int(11) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_transfer` tinyint(1) NOT NULL DEFAULT 0,
  `role_type` enum('employee','call_center') NOT NULL DEFAULT 'employee',
  `manager_id` int(11) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_department_id` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'EMP001','Mr.','Admin',NULL,'User',1,NULL,'9999999999','admin@realboost.com',1,0,'employee',NULL,NULL,1,'2026-05-12 12:36:08','2026-05-12 12:36:08'),(2,'EMP002','Mr.','Rajesh',NULL,'Sharma',1,'Sales Manager','9810011111','rajesh@divyam.com',0,0,'employee',NULL,NULL,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,'EMP003','Ms.','Priya',NULL,'Verma',1,'Sales Executive','9820022222','priya@divyam.com',0,0,'employee',NULL,NULL,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,'EMP004','Mr.','Amit',NULL,'Gupta',1,'Accounts Manager','9830033333','amit@divyam.com',0,0,'employee',NULL,NULL,1,'2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `final_statements`
--

DROP TABLE IF EXISTS `final_statements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `final_statements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `total_cost` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_paid` decimal(14,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `generated_date` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `final_statements`
--

LOCK TABLES `final_statements` WRITE;
/*!40000 ALTER TABLE `final_statements` DISABLE KEYS */;
/*!40000 ALTER TABLE `final_statements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tower_id` int(11) NOT NULL,
  `floor_number` int(11) NOT NULL,
  `floor_name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_tower_id` (`tower_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,1,0,'Ground Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,1,1,'1st Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,1,2,'2nd Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,1,3,'3rd Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(5,1,4,'4th Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(6,1,5,'5th Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(7,2,0,'Ground Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(8,2,1,'1st Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(9,2,2,'2nd Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(10,2,3,'3rd Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(11,2,4,'4th Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(12,2,5,'5th Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(13,4,1,'1st Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(14,4,2,'2nd Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(15,4,3,'3rd Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(16,4,4,'4th Floor','2026-05-12 18:29:13','2026-05-12 18:29:13'),(17,4,5,'5th Floor','2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `held_units`
--

DROP TABLE IF EXISTS `held_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `held_units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `broker_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `hold_date` date NOT NULL,
  `unhold_date` date DEFAULT NULL,
  `status` enum('held','released') NOT NULL DEFAULT 'held',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_broker_id` (`broker_id`),
  KEY `idx_unit_id` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `held_units`
--

LOCK TABLES `held_units` WRITE;
/*!40000 ALTER TABLE `held_units` DISABLE KEYS */;
/*!40000 ALTER TABLE `held_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holding_charges`
--

DROP TABLE IF EXISTS `holding_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `holding_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `charge_per_day` decimal(10,2) NOT NULL,
  `effective_from` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holding_charges`
--

LOCK TABLES `holding_charges` WRITE;
/*!40000 ALTER TABLE `holding_charges` DISABLE KEYS */;
/*!40000 ALTER TABLE `holding_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ifms_charges`
--

DROP TABLE IF EXISTS `ifms_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ifms_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `rate` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ifms_charges`
--

LOCK TABLES `ifms_charges` WRITE;
/*!40000 ALTER TABLE `ifms_charges` DISABLE KEYS */;
INSERT INTO `ifms_charges` VALUES (1,1,'Interest Free Maintenance Security',50.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,2,'Interest Free Maintenance Security',60.00,'2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `ifms_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installments`
--

DROP TABLE IF EXISTS `installments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `installments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_id` int(11) NOT NULL,
  `stage_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `due_type` enum('date','milestone','on_booking') NOT NULL DEFAULT 'date',
  `due_date` date DEFAULT NULL,
  `percentage` decimal(6,2) NOT NULL DEFAULT 0.00,
  `amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_plan_id` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installments`
--

LOCK TABLES `installments` WRITE;
/*!40000 ALTER TABLE `installments` DISABLE KEYS */;
INSERT INTO `installments` VALUES (1,1,1,'Booking Amount','on_booking',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(2,1,2,'Foundation Commencement','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(3,1,3,'Ground Floor Slab','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(4,1,4,'5th Floor Slab','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(5,1,5,'10th Floor Slab','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(6,1,6,'15th Floor Slab','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(7,1,7,'Top Floor Slab','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(8,1,8,'Plastering','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(9,1,9,'Flooring','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(10,1,10,'On Possession','milestone',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(11,4,11,'Booking Amount','on_booking',NULL,10.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(12,4,12,'Commencement','milestone',NULL,15.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(13,4,13,'Ground Slab','milestone',NULL,15.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(14,4,14,'10th Floor Slab','milestone',NULL,15.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(15,4,15,'20th Floor Slab','milestone',NULL,15.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(16,4,16,'Top Floor Slab','milestone',NULL,15.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(17,4,17,'On Possession','milestone',NULL,15.00,0.00,'2026-05-12 18:29:15','2026-05-12 18:29:15');
/*!40000 ALTER TABLE `installments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journal_entries`
--

DROP TABLE IF EXISTS `journal_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `entry_date` date NOT NULL,
  `amount` decimal(14,2) NOT NULL,
  `entry_type` enum('JV','DR','CR','Refund') NOT NULL DEFAULT 'JV',
  `narration` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journal_entries`
--

LOCK TABLES `journal_entries` WRITE;
/*!40000 ALTER TABLE `journal_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `journal_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `letter_templates`
--

DROP TABLE IF EXISTS `letter_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `letter_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `head_format` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `letter_templates`
--

LOCK TABLES `letter_templates` WRITE;
/*!40000 ALTER TABLE `letter_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `letter_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_details`
--

DROP TABLE IF EXISTS `loan_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loan_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `branch` varchar(150) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `file_no` varchar(50) DEFAULT NULL,
  `file_date` date DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `sanctioned_amount` decimal(14,2) DEFAULT NULL,
  `bank_info` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_details`
--

LOCK TABLES `loan_details` WRITE;
/*!40000 ALTER TABLE `loan_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noc_requests`
--

DROP TABLE IF EXISTS `noc_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noc_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `request_date` date NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `approved_date` date DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noc_requests`
--

LOCK TABLES `noc_requests` WRITE;
/*!40000 ALTER TABLE `noc_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `noc_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `other_charges`
--

DROP TABLE IF EXISTS `other_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `other_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `rate` decimal(12,2) NOT NULL DEFAULT 0.00,
  `charge_type` enum('per_sqft','fixed') NOT NULL DEFAULT 'fixed',
  `is_mandatory` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `other_charges`
--

LOCK TABLES `other_charges` WRITE;
/*!40000 ALTER TABLE `other_charges` DISABLE KEYS */;
INSERT INTO `other_charges` VALUES (1,1,'Power Backup Charges',75000.00,'fixed',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,'Club Membership',150000.00,'fixed',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,'Maintenance Security Deposit',100000.00,'fixed',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,1,'Fire Fighting Charges',25.00,'per_sqft',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,2,'Power Backup',85000.00,'fixed',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(6,2,'Club & Gym Membership',200000.00,'fixed',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(7,2,'Maintenance Deposit',150000.00,'fixed',1,'2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `other_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parking_types`
--

DROP TABLE IF EXISTS `parking_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parking_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `total` int(11) NOT NULL DEFAULT 0,
  `rate` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parking_types`
--

LOCK TABLES `parking_types` WRITE;
/*!40000 ALTER TABLE `parking_types` DISABLE KEYS */;
INSERT INTO `parking_types` VALUES (1,1,'Open Parking',120,0.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,'Covered Car Parking',142,350000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,'Open Reserved Car Parking',120,200000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,1,'Mechanical Car Parking',34,450000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,2,'Covered Car Parking',80,500000.00,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(6,2,'Open Parking',60,0.00,'2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `parking_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_plans`
--

DROP TABLE IF EXISTS `payment_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `plan_type` enum('flexi','regular','construction') NOT NULL DEFAULT 'regular',
  `discount_type` enum('percent','per_area') NOT NULL DEFAULT 'percent',
  `discount_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_100_percent` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_plans`
--

LOCK TABLES `payment_plans` WRITE;
/*!40000 ALTER TABLE `payment_plans` DISABLE KEYS */;
INSERT INTO `payment_plans` VALUES (1,1,'Construction Linked Plan','construction','percent',0.00,0,'Payment linked to construction milestones','2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,'Down Payment Plan 15%','regular','percent',15.00,0,'15% discount on full upfront payment','2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,'Subvention Scheme 20:80','flexi','percent',0.00,0,'20% now, 80% on possession','2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,2,'Construction Linked Plan','construction','percent',0.00,0,'Payment linked to milestones','2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,2,'Down Payment 10%','regular','percent',10.00,0,'10% discount on upfront payment','2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `payment_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_stages`
--

DROP TABLE IF EXISTS `payment_stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_stages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `stage_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_plan_id` (`plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_stages`
--

LOCK TABLES `payment_stages` WRITE;
/*!40000 ALTER TABLE `payment_stages` DISABLE KEYS */;
INSERT INTO `payment_stages` VALUES (1,1,1,'On Booking',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,1,'On Commencement of Foundation',2,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,1,'On Casting of Ground Floor Slab',3,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,1,1,'On Casting of 5th Floor Slab',4,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,1,1,'On Casting of 10th Floor Slab',5,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(6,1,1,'On Casting of 15th Floor Slab',6,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(7,1,1,'On Casting of Top Floor Slab',7,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(8,1,1,'On Plastering',8,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(9,1,1,'On Flooring',9,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(10,1,1,'On Possession',10,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(11,2,4,'On Booking',1,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(12,2,4,'On Commencement',2,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(13,2,4,'On Ground Floor Slab',3,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(14,2,4,'On 10th Floor Slab',4,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(15,2,4,'On 20th Floor Slab',5,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(16,2,4,'On Top Floor Slab',6,'2026-05-12 18:29:14','2026-05-12 18:29:14'),(17,2,4,'On Possession',7,'2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `payment_stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plc_charges`
--

DROP TABLE IF EXISTS `plc_charges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plc_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `rate` decimal(12,2) NOT NULL DEFAULT 0.00,
  `charge_type` enum('per_sqft','fixed') NOT NULL DEFAULT 'per_sqft',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plc_charges`
--

LOCK TABLES `plc_charges` WRITE;
/*!40000 ALTER TABLE `plc_charges` DISABLE KEYS */;
INSERT INTO `plc_charges` VALUES (1,1,'East Facing',75.00,'per_sqft','2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,'Corner Unit',100.00,'per_sqft','2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,'Park Facing',125.00,'per_sqft','2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,1,'Pool Facing',150.00,'per_sqft','2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,2,'High Floor (15+)',200.00,'per_sqft','2026-05-12 18:29:14','2026-05-12 18:29:14'),(6,2,'Expressway View',150.00,'per_sqft','2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `plc_charges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `possession_dates`
--

DROP TABLE IF EXISTS `possession_dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `possession_dates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `tower_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `booking_id` int(11) NOT NULL,
  `expected_date` date DEFAULT NULL,
  `actual_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `possession_dates`
--

LOCK TABLES `possession_dates` WRITE;
/*!40000 ALTER TABLE `possession_dates` DISABLE KEYS */;
INSERT INTO `possession_dates` VALUES (1,1,1,NULL,1,'2026-12-31',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(2,1,1,NULL,2,'2026-12-31',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(3,1,1,NULL,3,'2026-12-31',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(4,1,1,NULL,4,'2026-12-31',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(5,2,4,NULL,5,'2027-06-30',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17'),(6,2,4,NULL,6,'2027-06-30',NULL,'2026-05-12 18:29:17','2026-05-12 18:29:17');
/*!40000 ALTER TABLE `possession_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professions`
--

DROP TABLE IF EXISTS `professions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `professions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professions`
--

LOCK TABLES `professions` WRITE;
/*!40000 ALTER TABLE `professions` DISABLE KEYS */;
INSERT INTO `professions` VALUES (1,'Business','2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,'Service','2026-05-12 18:29:12','2026-05-12 18:29:12'),(3,'Professional','2026-05-12 18:29:12','2026-05-12 18:29:12'),(4,'Self Employed','2026-05-12 18:29:12','2026-05-12 18:29:12'),(5,'Retired','2026-05-12 18:29:12','2026-05-12 18:29:12'),(6,'NRI','2026-05-12 18:29:12','2026-05-12 18:29:12'),(7,'Student','2026-05-12 18:29:12','2026-05-12 18:29:12'),(8,'Homemaker','2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `professions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_configurations`
--

DROP TABLE IF EXISTS `project_configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_configurations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `booking_auth_type` varchar(20) NOT NULL DEFAULT 'auto',
  `receipt_no_prefix` varchar(20) NOT NULL DEFAULT 'REC',
  `registration_no_prefix` varchar(20) NOT NULL DEFAULT 'REG',
  `transfer_auth_type` varchar(20) NOT NULL DEFAULT 'auto',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_configurations`
--

LOCK TABLES `project_configurations` WRITE;
/*!40000 ALTER TABLE `project_configurations` DISABLE KEYS */;
INSERT INTO `project_configurations` VALUES (1,1,'auto','OVH-REC','OVH','manual','2026-05-12 18:29:15','2026-05-12 18:29:15'),(2,2,'auto','TVR-REC','TVR','manual','2026-05-12 18:29:15','2026-05-12 18:29:15');
/*!40000 ALTER TABLE `project_configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_types`
--

DROP TABLE IF EXISTS `project_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_types`
--

LOCK TABLES `project_types` WRITE;
/*!40000 ALTER TABLE `project_types` DISABLE KEYS */;
INSERT INTO `project_types` VALUES (1,'Residential','2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,'Commercial','2026-05-12 18:29:12','2026-05-12 18:29:12'),(3,'Mixed Use','2026-05-12 18:29:12','2026-05-12 18:29:12'),(4,'Plotted Development','2026-05-12 18:29:12','2026-05-12 18:29:12'),(5,'Villa','2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `project_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `project_type_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `pin` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `possession_date` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_company_id` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,1,1,'OASIS VENETIA HEIGHTS','OVH','Sector 70A, Near Expressway','Noida','Uttar Pradesh','India','201301','ovh@divyam.com','0120-4001234','Premium residential apartments with world-class amenities','2020-01-01','2026-12-31',1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,1,1,'THE VAULT RESIDENCES','TVR','Sector 150, Noida Expressway','Noida','Uttar Pradesh','India','201310','vault@divyam.com','0120-4005678','Luxury high-rise apartments with panoramic views','2021-06-01','2027-06-30',1,'2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `unit_type_id` int(11) DEFAULT NULL,
  `rate_per_sqft` decimal(12,2) NOT NULL,
  `effective_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
INSERT INTO `rates` VALUES (1,1,1,5500.00,'2020-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,2,5800.00,'2020-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,3,6000.00,'2020-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,1,4,6500.00,'2020-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,1,5,8000.00,'2020-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(6,1,1,6200.00,'2023-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(7,1,2,6500.00,'2023-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(8,1,3,6800.00,'2023-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(9,1,4,7200.00,'2023-01-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(10,2,6,7500.00,'2021-06-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(11,2,7,7800.00,'2021-06-01','2026-05-12 18:29:14','2026-05-12 18:29:14'),(12,2,8,8500.00,'2021-06-01','2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt_heads`
--

DROP TABLE IF EXISTS `receipt_heads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipt_heads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receipt_id` int(11) NOT NULL,
  `head_name` varchar(200) NOT NULL,
  `amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_receipt_id` (`receipt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt_heads`
--

LOCK TABLES `receipt_heads` WRITE;
/*!40000 ALTER TABLE `receipt_heads` DISABLE KEYS */;
/*!40000 ALTER TABLE `receipt_heads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receipts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `receipt_no` varchar(50) NOT NULL,
  `receipt_date` date NOT NULL,
  `receipt_type` enum('installment','booking','penalty','addon') NOT NULL DEFAULT 'installment',
  `payment_mode` enum('cash','cheque','online','dd','neft','rtgs') NOT NULL DEFAULT 'cheque',
  `amount` decimal(14,2) NOT NULL,
  `penalty_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(14,2) NOT NULL,
  `instrument_no` varchar(100) DEFAULT NULL,
  `instrument_date` date DEFAULT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `branch` varchar(150) DEFAULT NULL,
  `micr` varchar(20) DEFAULT NULL,
  `narration` text DEFAULT NULL,
  `is_cancelled` tinyint(1) NOT NULL DEFAULT 0,
  `is_duplicate` tinyint(1) NOT NULL DEFAULT 0,
  `challan_no` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_no` (`receipt_no`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_receipt_date` (`receipt_date`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
INSERT INTO `receipts` VALUES (1,1,1,'OVH-REC-0001','2022-03-15','booking','cheque',200000.00,0.00,200000.00,'CHQ001234','2022-03-12',NULL,'HDFC Sector 18',NULL,'Booking Amount',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(2,1,1,'OVH-REC-0002','2022-04-20','installment','neft',651000.00,0.00,651000.00,'NEFT20220420001','2022-04-20',NULL,NULL,NULL,'Foundation Stage - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(3,1,1,'OVH-REC-0003','2022-09-15','installment','cheque',651000.00,0.00,651000.00,'CHQ005678','2022-09-12',NULL,'ICICI Connaught Place',NULL,'Ground Floor Slab - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(4,1,1,'OVH-REC-0004','2023-02-10','installment','rtgs',651000.00,0.00,651000.00,'RTGS20230210','2023-02-10',NULL,NULL,NULL,'5th Floor Slab - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(5,2,1,'OVH-REC-0005','2022-06-20','booking','cheque',200000.00,0.00,200000.00,'CHQ009876','2022-06-18',NULL,'SBI Sector 37',NULL,'Booking Amount',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(6,2,1,'OVH-REC-0006','2022-09-01','installment','online',651000.00,0.00,651000.00,'ONL2022090100123','2022-09-01',NULL,NULL,NULL,'Foundation - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(7,3,1,'OVH-REC-0007','2022-08-10','booking','neft',200000.00,0.00,200000.00,'NEFT20220810002','2022-08-10',NULL,NULL,NULL,'Booking Amount',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(8,3,1,'OVH-REC-0008','2022-11-05','installment','rtgs',651000.00,0.00,651000.00,'RTGS20221105','2022-11-05',NULL,NULL,NULL,'Foundation - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(9,3,1,'OVH-REC-0009','2023-03-20','installment','cheque',651000.00,0.00,651000.00,'CHQ112233','2023-03-18',NULL,'HDFC Sector 62',NULL,'Ground Floor Slab - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(10,5,2,'TVR-REC-0001','2022-11-15','booking','neft',300000.00,0.00,300000.00,'NEFT20221115NRI','2022-11-15',NULL,NULL,NULL,'Booking Amount - NRI',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(11,5,2,'TVR-REC-0002','2023-01-20','installment','rtgs',825000.00,0.00,825000.00,'RTGS20230120','2023-01-20',NULL,NULL,NULL,'Commencement - 10%',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16'),(12,6,2,'TVR-REC-0003','2023-03-20','booking','cheque',300000.00,0.00,300000.00,'CHQ445566','2023-03-18',NULL,'Axis Bank GN',NULL,'Booking Amount',0,0,NULL,1,'2026-05-12 18:29:16','2026-05-12 18:29:16');
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registry_records`
--

DROP TABLE IF EXISTS `registry_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registry_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `registry_date` date NOT NULL,
  `stamp_duty` decimal(14,2) NOT NULL DEFAULT 0.00,
  `registration_charges` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total` decimal(14,2) NOT NULL DEFAULT 0.00,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registry_records`
--

LOCK TABLES `registry_records` WRITE;
/*!40000 ALTER TABLE `registry_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `registry_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminder_days`
--

DROP TABLE IF EXISTS `reminder_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reminder_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `r1_days` int(11) NOT NULL DEFAULT 7,
  `r2_days` int(11) NOT NULL DEFAULT 15,
  `r3_days` int(11) NOT NULL DEFAULT 30,
  `r4_days` int(11) NOT NULL DEFAULT 45,
  `termination_days` int(11) NOT NULL DEFAULT 60,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminder_days`
--

LOCK TABLES `reminder_days` WRITE;
/*!40000 ALTER TABLE `reminder_days` DISABLE KEYS */;
INSERT INTO `reminder_days` VALUES (1,1,7,15,30,45,60,'2026-05-12 18:29:15','2026-05-12 18:29:15'),(2,2,7,15,30,45,60,'2026-05-12 18:29:15','2026-05-12 18:29:15');
/*!40000 ALTER TABLE `reminder_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_menus`
--

DROP TABLE IF EXISTS `role_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `page_url` varchar(200) NOT NULL,
  `page_name` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `can_view` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_menus`
--

LOCK TABLES `role_menus` WRITE;
/*!40000 ALTER TABLE `role_menus` DISABLE KEYS */;
INSERT INTO `role_menus` VALUES (29,1,'/master/company','Company Creation','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(30,1,'/master/setup/area-type','Area Type','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(31,1,'/master/setup/currency','Currency','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(32,1,'/master/setup/profession','Profession','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(33,1,'/master/setup/bank/company','Company Bank','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(34,1,'/master/setup/bank/customer','Customer Bank','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(35,1,'/master/setup/bank/loan','Loan Bank','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(36,1,'/master/setup/country','Country Master','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(37,1,'/master/setup/letterhead','Letter Head Format','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(38,1,'/master/setup/reminders','Activity Reminders','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(39,1,'/master/employee/department','Department','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(40,1,'/master/employee/info','Employee Information','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(41,1,'/master/employee/report','Employee Report','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(42,1,'/master/employee/manager','Set Manager','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(43,1,'/master/employee/team','Team Master','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(44,1,'/master/employee/tree','Employee Tree','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(45,1,'/master/login/create','Create Login','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(46,1,'/master/login/view','View Login','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(47,1,'/master/documents/type','Document Type','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(48,1,'/master/roles/create','Role Creation','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(49,1,'/master/roles/menus','Role Wise Menus','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(50,1,'/master/security/password','Change Password','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(51,1,'/master/security/history','Login History','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(52,1,'/master/security/ip','IP Security','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(53,1,'/master/admin/audit','Customer Audit Track','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(54,1,'/master/admin/receipt-lock','Receipt Locking','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(55,1,'/master/admin/delete-customer','Delete Customer','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(56,1,'/master/setup/project-type','Project Type','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(57,1,'/master/admin/delete-receipt','Delete Receipt','Set Master',1,'2026-05-15 09:39:09','2026-05-15 09:39:09'),(58,2,'/application/booking/list','Booking List','Application',1,'2026-05-15 15:11:11','2026-05-15 15:11:11'),(59,2,'/application/booking/new','New Booking','Application',1,'2026-05-15 15:11:11','2026-05-15 15:11:11'),(60,2,'/application/receipts/list','Receipt List','Application',1,'2026-05-15 15:11:11','2026-05-15 15:11:11'),(61,2,'/application/receipts/new','New Receipt','Application',1,'2026-05-15 15:11:11','2026-05-15 15:11:11'),(62,2,'/application/demand/customer','Customer Wise Demand','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(63,2,'/application/demand/tower','Tower Wise Demand','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(64,2,'/application/demand/stage','Stage Wise Demand','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(65,2,'/application/documents/index','Customer Documents','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(66,2,'/application/banking/deposit','Cheque Deposit','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(67,2,'/application/banking/status','Verify Cheque Status','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(68,2,'/application/print/demand','Print Demand','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(69,2,'/application/print/ledger','Print Ledger','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(70,2,'/application/loan/index','Loan Process','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(71,2,'/application/surrender/apply','Surrender Application','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(72,2,'/application/surrender/report','Surrender Report','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(73,2,'/application/transfer/apply','Transfer Application','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(74,2,'/application/transfer/report','Transfer Report','Application',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(75,2,'/possession/possession-date','Possession Date','Possession',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(76,2,'/possession/handover','Handover','Possession',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(77,2,'/possession/final-statement','Final Statement','Possession',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(78,2,'/possession/noc-request','NOC Request','Possession',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(79,2,'/possession/registry','Registry','Possession',1,'2026-05-15 15:11:12','2026-05-15 15:11:12'),(80,3,'/application/booking/list','Booking List','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(81,3,'/application/receipts/list','Receipt List','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(82,3,'/application/receipts/new','New Receipt','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(83,3,'/application/demand/customer','Customer Wise Demand','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(84,3,'/application/print/demand','Print Demand','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(85,3,'/application/print/ledger','Print Ledger','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(86,3,'/application/banking/deposit','Cheque Deposit','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13'),(87,3,'/application/documents/index','Customer Documents','Application',1,'2026-05-15 15:11:13','2026-05-15 15:11:13');
/*!40000 ALTER TABLE `role_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin','Full access to all modules','2026-05-12 12:36:08','2026-05-12 12:36:08'),(2,'Manager','Access to application and reports modules','2026-05-15 15:11:11','2026-05-15 15:11:11'),(3,'Staff','Limited access - bookings and receipts only','2026-05-15 15:11:11','2026-05-15 15:11:11');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sms_configs`
--

DROP TABLE IF EXISTS `sms_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sms_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `api_url` varchar(500) NOT NULL,
  `api_key` varchar(200) NOT NULL,
  `sender_id` varchar(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms_configs`
--

LOCK TABLES `sms_configs` WRITE;
/*!40000 ALTER TABLE `sms_configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `sms_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sms_logs`
--

DROP TABLE IF EXISTS `sms_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sms_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mobile` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `status` enum('sent','failed') NOT NULL DEFAULT 'sent',
  `sent_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sms_logs`
--

LOCK TABLES `sms_logs` WRITE;
/*!40000 ALTER TABLE `sms_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `sms_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `states` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_country_id` (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,1,'Uttar Pradesh','2026-05-12 18:29:12','2026-05-12 18:29:12'),(2,1,'Maharashtra','2026-05-12 18:29:12','2026-05-12 18:29:12'),(3,1,'Delhi','2026-05-12 18:29:12','2026-05-12 18:29:12'),(4,1,'Rajasthan','2026-05-12 18:29:12','2026-05-12 18:29:12'),(5,1,'Gujarat','2026-05-12 18:29:12','2026-05-12 18:29:12'),(6,1,'Karnataka','2026-05-12 18:29:12','2026-05-12 18:29:12'),(7,1,'Telangana','2026-05-12 18:29:12','2026-05-12 18:29:12'),(8,1,'Tamil Nadu','2026-05-12 18:29:12','2026-05-12 18:29:12');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surrenders`
--

DROP TABLE IF EXISTS `surrenders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `surrenders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `surrender_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('surrendered','restored') NOT NULL DEFAULT 'surrendered',
  `restored_date` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_id` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surrenders`
--

LOCK TABLES `surrenders` WRITE;
/*!40000 ALTER TABLE `surrenders` DISABLE KEYS */;
/*!40000 ALTER TABLE `surrenders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `towers`
--

DROP TABLE IF EXISTS `towers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `towers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `total_floors` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `towers`
--

LOCK TABLES `towers` WRITE;
/*!40000 ALTER TABLE `towers` DISABLE KEYS */;
INSERT INTO `towers` VALUES (1,1,'Tower A','TA',25,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,1,'Tower B','TB',25,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,1,'Tower C','TC',20,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,2,'East Wing','EW',30,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(5,2,'West Wing','WW',30,'2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `towers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfers`
--

DROP TABLE IF EXISTS `transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transfers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_booking_id` int(11) NOT NULL,
  `to_booking_id` int(11) DEFAULT NULL,
  `transfer_date` date NOT NULL,
  `transfer_fee` decimal(14,2) NOT NULL DEFAULT 0.00,
  `service_tax` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','completed') NOT NULL DEFAULT 'pending',
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfers`
--

LOCK TABLES `transfers` WRITE;
/*!40000 ALTER TABLE `transfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_address_owners`
--

DROP TABLE IF EXISTS `unit_address_owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unit_address_owners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `owner_name` varchar(200) NOT NULL,
  `address` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_address_owners`
--

LOCK TABLES `unit_address_owners` WRITE;
/*!40000 ALTER TABLE `unit_address_owners` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_address_owners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_locations`
--

DROP TABLE IF EXISTS `unit_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unit_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_locations`
--

LOCK TABLES `unit_locations` WRITE;
/*!40000 ALTER TABLE `unit_locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_shifts`
--

DROP TABLE IF EXISTS `unit_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unit_shifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_booking_id` int(11) NOT NULL,
  `to_unit_id` int(11) NOT NULL,
  `shift_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_shifts`
--

LOCK TABLES `unit_shifts` WRITE;
/*!40000 ALTER TABLE `unit_shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `unit_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_types`
--

DROP TABLE IF EXISTS `unit_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unit_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  `area_type_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_types`
--

LOCK TABLES `unit_types` WRITE;
/*!40000 ALTER TABLE `unit_types` DISABLE KEYS */;
INSERT INTO `unit_types` VALUES (1,1,'2BHK Standard',1050.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(2,1,'2BHK Premium',1200.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(3,1,'3BHK Standard',1450.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(4,1,'3BHK Premium',1650.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(5,1,'4BHK Penthouse',2800.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(6,2,'2BHK',1100.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(7,2,'3BHK',1500.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13'),(8,2,'4BHK',2100.00,1,'2026-05-12 18:29:13','2026-05-12 18:29:13');
/*!40000 ALTER TABLE `unit_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `tower_id` int(11) NOT NULL,
  `floor_id` int(11) NOT NULL,
  `unit_type_id` int(11) DEFAULT NULL,
  `unit_number` varchar(50) NOT NULL,
  `address_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `area` decimal(10,2) DEFAULT NULL,
  `status` enum('available','booked','sold','cancelled','held') NOT NULL DEFAULT 'available',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_tower_id` (`tower_id`),
  KEY `idx_floor_id` (`floor_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,1,1,1,1,'A-001',NULL,NULL,1050.00,'sold','2026-05-12 18:29:14','2026-05-12 18:29:14'),(2,1,1,1,1,'A-002',NULL,NULL,1050.00,'booked','2026-05-12 18:29:14','2026-05-12 18:29:14'),(3,1,1,1,2,'A-003',NULL,NULL,1200.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(4,1,1,1,2,'A-004',NULL,NULL,1200.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(5,1,1,2,1,'A-101',NULL,NULL,1050.00,'sold','2026-05-12 18:29:14','2026-05-12 18:29:14'),(6,1,1,2,1,'A-102',NULL,NULL,1050.00,'booked','2026-05-12 18:29:14','2026-05-12 18:29:14'),(7,1,1,2,3,'A-103',NULL,NULL,1450.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(8,1,1,2,3,'A-104',NULL,NULL,1450.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(9,1,1,3,3,'A-201',NULL,NULL,1450.00,'sold','2026-05-12 18:29:14','2026-05-12 18:29:14'),(10,1,1,3,3,'A-202',NULL,NULL,1450.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(11,1,1,3,4,'A-203',NULL,NULL,1650.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(12,1,1,3,4,'A-204',NULL,NULL,1650.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(13,1,1,4,4,'A-301',NULL,NULL,1650.00,'booked','2026-05-12 18:29:14','2026-05-12 18:29:14'),(14,1,1,4,4,'A-302',NULL,NULL,1650.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(15,1,1,4,3,'A-303',NULL,NULL,1450.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(16,1,1,4,3,'A-304',NULL,NULL,1450.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(17,1,2,8,2,'B-101',NULL,NULL,1200.00,'sold','2026-05-12 18:29:14','2026-05-12 18:29:14'),(18,1,2,8,2,'B-102',NULL,NULL,1200.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(19,1,2,8,3,'B-103',NULL,NULL,1450.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(20,1,2,8,4,'B-104',NULL,NULL,1650.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(21,2,4,13,6,'EW-101',NULL,NULL,1100.00,'sold','2026-05-12 18:29:14','2026-05-12 18:29:14'),(22,2,4,13,6,'EW-102',NULL,NULL,1100.00,'booked','2026-05-12 18:29:14','2026-05-12 18:29:14'),(23,2,4,13,7,'EW-103',NULL,NULL,1500.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(24,2,4,13,8,'EW-104',NULL,NULL,2100.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(25,2,4,14,6,'EW-201',NULL,NULL,1100.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(26,2,4,14,7,'EW-202',NULL,NULL,1500.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14'),(27,2,4,14,8,'EW-203',NULL,NULL,2100.00,'available','2026-05-12 18:29:14','2026-05-12 18:29:14');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'admin','$2b$12$qoh2xxEViXnOq0V9OMTOY.WlpSiCt.R2h5oI5jj/mnqvz7BrGFD96',1,1,'2026-05-16 05:00:59','2026-05-12 12:36:08','2026-05-16 05:00:59'),(2,2,'manager','$2b$12$tl8Q8WI0wsDF1BehT1Aquu6n453e7MQgDN6x/rrdWpjNb9gznRD.K',2,1,'2026-05-16 05:00:43','2026-05-15 15:06:19','2026-05-16 05:00:43'),(3,3,'staff','$2b$12$.zuCxl.nMbX72pGbCzQLKeoyNZVAFaqJ7dXF.x4IKmyl1Er6fJuLG',3,1,'2026-05-15 12:24:40','2026-05-15 15:06:20','2026-05-15 12:24:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 11:00:44
