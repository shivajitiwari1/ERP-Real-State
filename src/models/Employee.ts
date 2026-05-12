import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

export type RoleType = 'employee' | 'call_center';

interface EmpAttributes {
  id: number; code: string; salutation: string;
  firstName: string; middleName?: string; lastName: string;
  departmentId: number; designation?: string;
  mobile: string; email: string;
  isAdmin: boolean; isTransfer: boolean; roleType: RoleType;
  managerId?: number | null; joiningDate?: Date; isActive: boolean;
}
interface EmpCreation extends Optional<EmpAttributes, 'id' | 'middleName' | 'designation' | 'managerId' | 'joiningDate'> {}

class Employee extends Model<EmpAttributes, EmpCreation> implements EmpAttributes {
  public id!: number; public code!: string; public salutation!: string;
  public firstName!: string; public middleName?: string; public lastName!: string;
  public departmentId!: number; public designation?: string;
  public mobile!: string; public email!: string;
  public isAdmin!: boolean; public isTransfer!: boolean; public roleType!: RoleType;
  public managerId?: number | null; public joiningDate?: Date; public isActive!: boolean;
}

Employee.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  salutation: { type: DataTypes.STRING(10), allowNull: false },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  middleName: DataTypes.STRING(100),
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  departmentId: { type: DataTypes.INTEGER, allowNull: false },
  designation: DataTypes.STRING(100),
  mobile: { type: DataTypes.STRING(20), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  isTransfer: { type: DataTypes.BOOLEAN, defaultValue: false },
  roleType: { type: DataTypes.ENUM('employee', 'call_center'), defaultValue: 'employee' },
  managerId: { type: DataTypes.INTEGER, allowNull: true },
  joiningDate: DataTypes.DATEONLY,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'Employee', tableName: 'employees' });

export default Employee;
