import sequelize from '@/lib/db';
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

// Associations
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

export async function syncDatabase() {
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
}

export {
  sequelize, Company, Department, Role, RoleMenu, Employee, User,
  BankCompany, BankCustomer, BankLoan, Currency, Profession,
  Country, State, City, AreaType, ProjectType, DocumentType, LetterTemplate,
};
