import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface CompanyAttributes {
  id: number; code: string; groupName: string; name: string;
  address1: string; address2?: string; address3?: string;
  city: string; state: string; country: string; pin: string;
  phone?: string; fax?: string; email?: string; website?: string;
  cin?: string; serviceTaxNo?: string; panNo?: string; vatRegNo?: string;
  payableAt?: string; logo?: string;
}
interface CompanyCreation extends Optional<CompanyAttributes, 'id' | 'address2' | 'address3' | 'phone' | 'fax' | 'email' | 'website' | 'cin' | 'serviceTaxNo' | 'panNo' | 'vatRegNo' | 'payableAt' | 'logo'> {}

class Company extends Model<CompanyAttributes, CompanyCreation> implements CompanyAttributes {
  public id!: number; public code!: string; public groupName!: string;
  public name!: string; public address1!: string; public address2?: string;
  public address3?: string; public city!: string; public state!: string;
  public country!: string; public pin!: string; public phone?: string;
  public fax?: string; public email?: string; public website?: string;
  public cin?: string; public serviceTaxNo?: string; public panNo?: string;
  public vatRegNo?: string; public payableAt?: string; public logo?: string;
}

Company.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  groupName: { type: DataTypes.STRING(100), allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  address1: { type: DataTypes.TEXT, allowNull: false },
  address2: DataTypes.TEXT,
  address3: DataTypes.TEXT,
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  pin: { type: DataTypes.STRING(20), allowNull: false },
  phone: DataTypes.STRING(50),
  fax: DataTypes.STRING(50),
  email: DataTypes.STRING(150),
  website: DataTypes.STRING(200),
  cin: DataTypes.STRING(50),
  serviceTaxNo: DataTypes.STRING(50),
  panNo: DataTypes.STRING(20),
  vatRegNo: DataTypes.STRING(50),
  payableAt: DataTypes.STRING(100),
  logo: DataTypes.STRING(500),
}, { sequelize, modelName: 'Company', tableName: 'companies' });

export default Company;
