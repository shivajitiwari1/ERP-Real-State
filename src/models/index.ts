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
};
