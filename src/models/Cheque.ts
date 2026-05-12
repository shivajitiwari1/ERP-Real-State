import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; receiptId: number; chequeNo: string; chequeDate: Date;
  bankName: string; branch?: string; micr?: string; amount: number;
  status: string; depositDate?: Date; clearDate?: Date; bounceDate?: Date; remarks?: string;
}
interface Creation extends Optional<Attrs, 'id' | 'branch' | 'micr' | 'depositDate' | 'clearDate' | 'bounceDate' | 'remarks'> {}

class Cheque extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public receiptId!: number; public chequeNo!: string; public chequeDate!: Date;
  public bankName!: string; public branch?: string; public micr?: string; public amount!: number;
  public status!: string; public depositDate?: Date; public clearDate?: Date; public bounceDate?: Date; public remarks?: string;
}

Cheque.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  receiptId: { type: DataTypes.INTEGER, allowNull: false },
  chequeNo: { type: DataTypes.STRING(50), allowNull: false },
  chequeDate: { type: DataTypes.DATEONLY, allowNull: false },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  branch: DataTypes.STRING(150),
  micr: DataTypes.STRING(20),
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'deposited', 'cleared', 'bounced', 'represented'), defaultValue: 'pending' },
  depositDate: DataTypes.DATEONLY,
  clearDate: DataTypes.DATEONLY,
  bounceDate: DataTypes.DATEONLY,
  remarks: DataTypes.TEXT,
}, { sequelize, modelName: 'Cheque', tableName: 'cheques' });

export default Cheque;
