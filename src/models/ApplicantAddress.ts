import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; applicantId: number; addressType: string;
  address?: string; pincode?: string; countryId?: number;
  stateId?: number; cityId?: number; stateText?: string; cityText?: string;
  mobile1?: string; mobile2?: string; phoneCode?: string; phone?: string; fax?: string;
}
interface Creation extends Optional<Attrs, 'id' | 'address' | 'pincode' | 'countryId' | 'stateId' | 'cityId' | 'stateText' | 'cityText' | 'mobile1' | 'mobile2' | 'phoneCode' | 'phone' | 'fax'> {}

class ApplicantAddress extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public applicantId!: number; public addressType!: string;
  public address?: string; public pincode?: string; public countryId?: number;
  public stateId?: number; public cityId?: number; public stateText?: string; public cityText?: string;
  public mobile1?: string; public mobile2?: string; public phoneCode?: string; public phone?: string; public fax?: string;
}

ApplicantAddress.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  applicantId: { type: DataTypes.INTEGER, allowNull: false },
  addressType: { type: DataTypes.ENUM('residential', 'office', 'permanent'), defaultValue: 'residential' },
  address: DataTypes.TEXT,
  pincode: DataTypes.STRING(20),
  countryId: DataTypes.INTEGER,
  stateId: DataTypes.INTEGER,
  cityId: DataTypes.INTEGER,
  stateText: DataTypes.STRING(100),
  cityText: DataTypes.STRING(100),
  mobile1: DataTypes.STRING(20),
  mobile2: DataTypes.STRING(20),
  phoneCode: DataTypes.STRING(10),
  phone: DataTypes.STRING(20),
  fax: DataTypes.STRING(20),
}, { sequelize, modelName: 'ApplicantAddress', tableName: 'applicant_addresses' });

export default ApplicantAddress;
