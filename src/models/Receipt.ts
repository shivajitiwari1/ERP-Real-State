import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface ReceiptAttributes {
  id: number; bookingId: number; projectId: number; receiptNo: string;
  receiptDate: Date; receiptType: string; paymentMode: string;
  amount: number; penaltyAmount: number; totalAmount: number;
  instrumentNo?: string; instrumentDate?: Date; bankId?: number;
  branch?: string; micr?: string; narration?: string;
  isCancelled: boolean; isDuplicate: boolean; challanNo?: string; createdBy?: number;
}
interface ReceiptCreation extends Optional<ReceiptAttributes, 'id' | 'penaltyAmount' | 'instrumentNo' | 'instrumentDate' | 'bankId' | 'branch' | 'micr' | 'narration' | 'challanNo' | 'createdBy'> {}

class Receipt extends Model<ReceiptAttributes, ReceiptCreation> implements ReceiptAttributes {
  public id!: number; public bookingId!: number; public projectId!: number; public receiptNo!: string;
  public receiptDate!: Date; public receiptType!: string; public paymentMode!: string;
  public amount!: number; public penaltyAmount!: number; public totalAmount!: number;
  public instrumentNo?: string; public instrumentDate?: Date; public bankId?: number;
  public branch?: string; public micr?: string; public narration?: string;
  public isCancelled!: boolean; public isDuplicate!: boolean; public challanNo?: string; public createdBy?: number;
}

Receipt.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  receiptNo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  receiptDate: { type: DataTypes.DATEONLY, allowNull: false },
  receiptType: { type: DataTypes.ENUM('installment', 'booking', 'penalty', 'addon'), defaultValue: 'installment' },
  paymentMode: { type: DataTypes.ENUM('cash', 'cheque', 'online', 'dd', 'neft', 'rtgs'), defaultValue: 'cheque' },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  penaltyAmount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  instrumentNo: DataTypes.STRING(100),
  instrumentDate: DataTypes.DATEONLY,
  bankId: DataTypes.INTEGER,
  branch: DataTypes.STRING(150),
  micr: DataTypes.STRING(20),
  narration: DataTypes.TEXT,
  isCancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  isDuplicate: { type: DataTypes.BOOLEAN, defaultValue: false },
  challanNo: DataTypes.STRING(50),
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'Receipt', tableName: 'receipts' });

export default Receipt;
