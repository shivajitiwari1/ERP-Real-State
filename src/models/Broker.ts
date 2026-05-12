import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface BrokerAttributes {
  id: number; code: string; companyName?: string; estdYear?: number;
  salutation?: string; firstName: string; middleName?: string; lastName: string;
  designation?: string; dob?: Date; anniversaryDate?: Date;
  panNo?: string; tanNo?: string; serviceTaxNo?: string;
  isGstRegistered: boolean; isTdsApplicable: boolean;
  depositMoney?: number; poaDate?: Date; references?: string;
  strengthOfSalesForce?: number; managerName?: string; officerName?: string;
  remark?: string; address?: string; phone?: string; city?: string;
  mobile?: string; state?: string; email?: string; pincode?: string;
  licenceNo?: string; bankName?: string; bankBranch?: string;
  accountNo?: string; ifsc?: string; isActive: boolean;
}
interface BrokerCreation extends Optional<BrokerAttributes, 'id' | 'companyName' | 'estdYear' | 'salutation' | 'middleName' | 'designation' | 'dob' | 'anniversaryDate' | 'panNo' | 'tanNo' | 'serviceTaxNo' | 'depositMoney' | 'poaDate' | 'references' | 'strengthOfSalesForce' | 'managerName' | 'officerName' | 'remark' | 'address' | 'phone' | 'city' | 'mobile' | 'state' | 'email' | 'pincode' | 'licenceNo' | 'bankName' | 'bankBranch' | 'accountNo' | 'ifsc'> {}

class Broker extends Model<BrokerAttributes, BrokerCreation> implements BrokerAttributes {
  public id!: number; public code!: string; public companyName?: string; public estdYear?: number;
  public salutation?: string; public firstName!: string; public middleName?: string; public lastName!: string;
  public designation?: string; public dob?: Date; public anniversaryDate?: Date;
  public panNo?: string; public tanNo?: string; public serviceTaxNo?: string;
  public isGstRegistered!: boolean; public isTdsApplicable!: boolean;
  public depositMoney?: number; public poaDate?: Date; public references?: string;
  public strengthOfSalesForce?: number; public managerName?: string; public officerName?: string;
  public remark?: string; public address?: string; public phone?: string; public city?: string;
  public mobile?: string; public state?: string; public email?: string; public pincode?: string;
  public licenceNo?: string; public bankName?: string; public bankBranch?: string;
  public accountNo?: string; public ifsc?: string; public isActive!: boolean;
}

Broker.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  companyName: DataTypes.TEXT,
  estdYear: DataTypes.INTEGER,
  salutation: DataTypes.STRING(10),
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  middleName: DataTypes.STRING(100),
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  designation: DataTypes.STRING(100),
  dob: DataTypes.DATEONLY,
  anniversaryDate: DataTypes.DATEONLY,
  panNo: DataTypes.STRING(20),
  tanNo: DataTypes.STRING(20),
  serviceTaxNo: DataTypes.STRING(50),
  isGstRegistered: { type: DataTypes.BOOLEAN, defaultValue: false },
  isTdsApplicable: { type: DataTypes.BOOLEAN, defaultValue: false },
  depositMoney: DataTypes.DECIMAL(14, 2),
  poaDate: DataTypes.DATEONLY,
  references: DataTypes.TEXT,
  strengthOfSalesForce: DataTypes.INTEGER,
  managerName: DataTypes.STRING(200),
  officerName: DataTypes.STRING(200),
  remark: DataTypes.TEXT,
  address: DataTypes.TEXT,
  phone: DataTypes.STRING(50),
  city: DataTypes.STRING(100),
  mobile: DataTypes.STRING(20),
  state: DataTypes.STRING(100),
  email: DataTypes.STRING(150),
  pincode: DataTypes.STRING(20),
  licenceNo: DataTypes.STRING(50),
  bankName: DataTypes.STRING(150),
  bankBranch: DataTypes.STRING(150),
  accountNo: DataTypes.STRING(50),
  ifsc: DataTypes.STRING(20),
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'Broker', tableName: 'brokers' });

export default Broker;
