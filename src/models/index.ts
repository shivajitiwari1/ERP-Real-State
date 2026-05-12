import sequelize from '@/lib/db';

// Phase 1 models
import Company from './Company';
import Department from './Department';
import Role from './Role';
import RoleMenu from './RoleMenu';
import Employee from './Employee';
import User from './User';
import BankCompany from './BankCompany';
import BankCustomer from './BankCustomer';
import BankLoan from './BankLoan';
import Currency from './Currency';
import Profession from './Profession';
import Country from './Country';
import State from './State';
import City from './City';
import AreaType from './AreaType';
import ProjectType from './ProjectType';
import DocumentType from './DocumentType';
import LetterTemplate from './LetterTemplate';

// Phase 2 models
import Project from './Project';
import Tower from './Tower';
import Floor from './Floor';
import UnitType from './UnitType';
import Unit from './Unit';
import UnitLocation from './UnitLocation';
import UnitAddressOwner from './UnitAddressOwner';
import PlcCharge from './PlcCharge';
import OtherCharge from './OtherCharge';
import AddonCharge from './AddonCharge';
import IfmsCharge from './IfmsCharge';
import ParkingType from './ParkingType';
import ProjectConfiguration from './ProjectConfiguration';
import PaymentPlan from './PaymentPlan';
import PaymentStage from './PaymentStage';
import Installment from './Installment';
import BookingAmount from './BookingAmount';
import Rate from './Rate';
import ReminderDays from './ReminderDays';

// Phase 3 models
import Booking from './Booking';
import Applicant from './Applicant';
import ApplicantAddress from './ApplicantAddress';
import Agreement from './Agreement';
import Receipt from './Receipt';
import ReceiptHead from './ReceiptHead';
import Demand from './Demand';
import Cheque from './Cheque';
import LoanDetail from './LoanDetail';
import Surrender from './Surrender';
import Transfer from './Transfer';
import UnitShift from './UnitShift';
import JournalEntry from './JournalEntry';

// Phase 5-7 models
import Broker from './Broker';
import BrokerProjectMapping from './BrokerProjectMapping';
import HeldUnit from './HeldUnit';
import EmailConfig from './EmailConfig';
import EmailLog from './EmailLog';
import SmsConfig from './SmsConfig';
import SmsLog from './SmsLog';
import AddressGroup from './AddressGroup';
import AddressBook from './AddressBook';
import PossessionDate from './PossessionDate';
import NocRequest from './NocRequest';
import HoldingCharge from './HoldingCharge';
import RegistryRecord from './RegistryRecord';
import FinalStatement from './FinalStatement';

// ── Phase 1 Associations ──────────────────────────────────────────────
Role.hasMany(RoleMenu, { foreignKey: 'roleId', as: 'menus' });
RoleMenu.belongsTo(Role, { foreignKey: 'roleId' });

Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

Employee.hasOne(User, { foreignKey: 'employeeId' });
User.belongsTo(Employee, { foreignKey: 'employeeId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Employee.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'managerId', as: 'reports' });

Country.hasMany(State, { foreignKey: 'countryId' });
State.belongsTo(Country, { foreignKey: 'countryId' });
State.hasMany(City, { foreignKey: 'stateId' });
City.belongsTo(State, { foreignKey: 'stateId' });

// ── Phase 2 Associations ──────────────────────────────────────────────
Company.hasMany(Project, { foreignKey: 'companyId' });
Project.belongsTo(Company, { foreignKey: 'companyId' });
Project.belongsTo(ProjectType, { foreignKey: 'projectTypeId' });

Project.hasMany(Tower, { foreignKey: 'projectId' });
Tower.belongsTo(Project, { foreignKey: 'projectId' });

Tower.hasMany(Floor, { foreignKey: 'towerId' });
Floor.belongsTo(Tower, { foreignKey: 'towerId' });

Floor.hasMany(Unit, { foreignKey: 'floorId' });
Unit.belongsTo(Floor, { foreignKey: 'floorId' });
Unit.belongsTo(Tower, { foreignKey: 'towerId' });
Unit.belongsTo(Project, { foreignKey: 'projectId' });
Unit.belongsTo(UnitType, { foreignKey: 'unitTypeId' });

Project.hasMany(UnitType, { foreignKey: 'projectId' });
UnitType.belongsTo(Project, { foreignKey: 'projectId' });
UnitType.belongsTo(AreaType, { foreignKey: 'areaTypeId' });

Project.hasMany(UnitLocation, { foreignKey: 'projectId' });
Project.hasMany(UnitAddressOwner, { foreignKey: 'projectId' });
Project.hasMany(PlcCharge, { foreignKey: 'projectId' });
Project.hasMany(OtherCharge, { foreignKey: 'projectId' });
Project.hasMany(AddonCharge, { foreignKey: 'projectId' });
Project.hasMany(IfmsCharge, { foreignKey: 'projectId' });
Project.hasMany(ParkingType, { foreignKey: 'projectId' });
Project.hasOne(ProjectConfiguration, { foreignKey: 'projectId' });
Project.hasMany(PaymentPlan, { foreignKey: 'projectId' });
Project.hasMany(Rate, { foreignKey: 'projectId' });
Project.hasOne(ReminderDays, { foreignKey: 'projectId' });

PaymentPlan.hasMany(PaymentStage, { foreignKey: 'planId' });
PaymentStage.belongsTo(PaymentPlan, { foreignKey: 'planId' });

PaymentPlan.hasMany(Installment, { foreignKey: 'planId' });
Installment.belongsTo(PaymentPlan, { foreignKey: 'planId' });
Installment.belongsTo(PaymentStage, { foreignKey: 'stageId' });

PaymentPlan.hasMany(BookingAmount, { foreignKey: 'planId' });

Rate.belongsTo(UnitType, { foreignKey: 'unitTypeId' });

// ── Phase 3 Associations ──────────────────────────────────────────────
Booking.belongsTo(Project, { foreignKey: 'projectId' });
Booking.belongsTo(Unit, { foreignKey: 'unitId' });
Booking.belongsTo(PaymentPlan, { foreignKey: 'planId' });
Booking.hasMany(Applicant, { foreignKey: 'bookingId' });
Booking.hasMany(Receipt, { foreignKey: 'bookingId' });
Booking.hasMany(Demand, { foreignKey: 'bookingId' });
Booking.hasOne(Agreement, { foreignKey: 'bookingId' });
Booking.hasOne(LoanDetail, { foreignKey: 'bookingId' });
Booking.hasMany(Surrender, { foreignKey: 'bookingId' });
Booking.hasMany(Transfer, { foreignKey: 'fromBookingId', as: 'outTransfers' });
Booking.hasMany(UnitShift, { foreignKey: 'fromBookingId' });
Booking.hasMany(JournalEntry, { foreignKey: 'bookingId' });

Project.hasMany(Booking, { foreignKey: 'projectId' });
Unit.hasMany(Booking, { foreignKey: 'unitId' });

Applicant.belongsTo(Booking, { foreignKey: 'bookingId' });
Applicant.hasMany(ApplicantAddress, { foreignKey: 'applicantId' });
ApplicantAddress.belongsTo(Applicant, { foreignKey: 'applicantId' });

Receipt.belongsTo(Booking, { foreignKey: 'bookingId' });
Receipt.belongsTo(Project, { foreignKey: 'projectId' });
Receipt.hasMany(ReceiptHead, { foreignKey: 'receiptId' });
Receipt.hasMany(Cheque, { foreignKey: 'receiptId' });
ReceiptHead.belongsTo(Receipt, { foreignKey: 'receiptId' });
Cheque.belongsTo(Receipt, { foreignKey: 'receiptId' });

Demand.belongsTo(Booking, { foreignKey: 'bookingId' });
Demand.belongsTo(Project, { foreignKey: 'projectId' });
Demand.belongsTo(Installment, { foreignKey: 'installmentId' });
Demand.belongsTo(PaymentStage, { foreignKey: 'stageId' });

Agreement.belongsTo(Booking, { foreignKey: 'bookingId' });
Surrender.belongsTo(Booking, { foreignKey: 'bookingId' });
Transfer.belongsTo(Booking, { foreignKey: 'fromBookingId', as: 'fromBooking' });
LoanDetail.belongsTo(Booking, { foreignKey: 'bookingId' });
LoanDetail.belongsTo(BankLoan, { foreignKey: 'bankId' });

// ── Phase 5-7 Associations ────────────────────────────────────────────
Broker.hasMany(BrokerProjectMapping, { foreignKey: 'brokerId' });
BrokerProjectMapping.belongsTo(Broker, { foreignKey: 'brokerId' });
BrokerProjectMapping.belongsTo(Project, { foreignKey: 'projectId' });
Broker.hasMany(HeldUnit, { foreignKey: 'brokerId' });
HeldUnit.belongsTo(Broker, { foreignKey: 'brokerId' });
HeldUnit.belongsTo(Unit, { foreignKey: 'unitId' });

AddressGroup.hasMany(AddressBook, { foreignKey: 'groupId' });
AddressBook.belongsTo(AddressGroup, { foreignKey: 'groupId' });

Booking.hasOne(PossessionDate, { foreignKey: 'bookingId' });
PossessionDate.belongsTo(Booking, { foreignKey: 'bookingId' });
Booking.hasMany(NocRequest, { foreignKey: 'bookingId' });
NocRequest.belongsTo(Booking, { foreignKey: 'bookingId' });
Booking.hasOne(RegistryRecord, { foreignKey: 'bookingId' });
Booking.hasOne(FinalStatement, { foreignKey: 'bookingId' });
Project.hasMany(HoldingCharge, { foreignKey: 'projectId' });

export async function syncDatabase() {
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
}

export {
  // Phase 1
  sequelize, Company, Department, Role, RoleMenu, Employee, User,
  BankCompany, BankCustomer, BankLoan, Currency, Profession,
  Country, State, City, AreaType, ProjectType, DocumentType, LetterTemplate,
  // Phase 2
  Project, Tower, Floor, UnitType, Unit, UnitLocation, UnitAddressOwner,
  PlcCharge, OtherCharge, AddonCharge, IfmsCharge, ParkingType,
  ProjectConfiguration, PaymentPlan, PaymentStage, Installment,
  BookingAmount, Rate, ReminderDays,
  // Phase 3
  Booking, Applicant, ApplicantAddress, Agreement, Receipt, ReceiptHead,
  Demand, Cheque, LoanDetail, Surrender, Transfer, UnitShift, JournalEntry,
  // Phase 5-7
  Broker, BrokerProjectMapping, HeldUnit,
  EmailConfig, EmailLog, SmsConfig, SmsLog, AddressGroup, AddressBook,
  PossessionDate, NocRequest, HoldingCharge, RegistryRecord, FinalStatement,
};
