import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; bookingId: number; bankId?: number; branch?: string;
  contactPerson?: string; contactNo?: string; fileNo?: string; fileDate?: Date;
  employeeId?: number; sanctionedAmount?: number; bankInfo?: string;
}
interface Creation extends Optional<Attrs, 'id' | 'bankId' | 'branch' | 'contactPerson' | 'contactNo' | 'fileNo' | 'fileDate' | 'employeeId' | 'sanctionedAmount' | 'bankInfo'> {}

class LoanDetail extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public bankId?: number; public branch?: string;
  public contactPerson?: string; public contactNo?: string; public fileNo?: string; public fileDate?: Date;
  public employeeId?: number; public sanctionedAmount?: number; public bankInfo?: string;
}

LoanDetail.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  bankId: DataTypes.INTEGER,
  branch: DataTypes.STRING(150),
  contactPerson: DataTypes.STRING(100),
  contactNo: DataTypes.STRING(20),
  fileNo: DataTypes.STRING(50),
  fileDate: DataTypes.DATEONLY,
  employeeId: DataTypes.INTEGER,
  sanctionedAmount: DataTypes.DECIMAL(14, 2),
  bankInfo: DataTypes.TEXT,
}, { sequelize, modelName: 'LoanDetail', tableName: 'loan_details' });

export default LoanDetail;
