import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface ApplicantAttributes {
  id: number; bookingId: number; applicantType: 'primary' | 'co';
  salutation?: string; firstName: string; middleName?: string; lastName: string;
  relationType?: string; relationName?: string;
  dob?: Date; anniversaryDate?: Date;
  nriStatus?: string; maritalStatus?: string; gender?: string;
  noOfChildren?: number; passportNo?: string; panNo?: string; aadhaarNo?: string;
  email1?: string; email2?: string; professionId?: number;
  designation?: string; companyName?: string; photo?: string;
  communicationPreference?: string;
}
interface ApplicantCreation extends Optional<ApplicantAttributes, 'id' | 'salutation' | 'middleName' | 'relationType' | 'relationName' | 'dob' | 'anniversaryDate' | 'nriStatus' | 'maritalStatus' | 'gender' | 'noOfChildren' | 'passportNo' | 'panNo' | 'aadhaarNo' | 'email1' | 'email2' | 'professionId' | 'designation' | 'companyName' | 'photo' | 'communicationPreference'> {}

class Applicant extends Model<ApplicantAttributes, ApplicantCreation> implements ApplicantAttributes {
  public id!: number; public bookingId!: number; public applicantType!: 'primary' | 'co';
  public salutation?: string; public firstName!: string; public middleName?: string; public lastName!: string;
  public relationType?: string; public relationName?: string;
  public dob?: Date; public anniversaryDate?: Date;
  public nriStatus?: string; public maritalStatus?: string; public gender?: string;
  public noOfChildren?: number; public passportNo?: string; public panNo?: string; public aadhaarNo?: string;
  public email1?: string; public email2?: string; public professionId?: number;
  public designation?: string; public companyName?: string; public photo?: string;
  public communicationPreference?: string;
}

Applicant.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  applicantType: { type: DataTypes.ENUM('primary', 'co'), defaultValue: 'primary' },
  salutation: DataTypes.STRING(10),
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  middleName: DataTypes.STRING(100),
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  relationType: DataTypes.STRING(20),
  relationName: DataTypes.STRING(200),
  dob: DataTypes.DATEONLY,
  anniversaryDate: DataTypes.DATEONLY,
  nriStatus: DataTypes.STRING(20),
  maritalStatus: DataTypes.STRING(20),
  gender: DataTypes.STRING(10),
  noOfChildren: DataTypes.INTEGER,
  passportNo: DataTypes.STRING(50),
  panNo: DataTypes.STRING(20),
  aadhaarNo: DataTypes.STRING(20),
  email1: DataTypes.STRING(150),
  email2: DataTypes.STRING(150),
  professionId: DataTypes.INTEGER,
  designation: DataTypes.STRING(100),
  companyName: DataTypes.STRING(200),
  photo: DataTypes.STRING(500),
  communicationPreference: DataTypes.STRING(20),
}, { sequelize, modelName: 'Applicant', tableName: 'applicants' });

export default Applicant;
