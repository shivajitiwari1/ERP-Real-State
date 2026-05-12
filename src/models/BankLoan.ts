import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; bankName: string; branch: string; contactPerson?: string; contactNo?: string; }
interface Creation extends Optional<Attrs, 'id' | 'contactPerson' | 'contactNo'> {}

class BankLoan extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bankName!: string; public branch!: string;
  public contactPerson?: string; public contactNo?: string;
}

BankLoan.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  branch: { type: DataTypes.STRING(150), allowNull: false },
  contactPerson: DataTypes.STRING(100),
  contactNo: DataTypes.STRING(20),
}, { sequelize, modelName: 'BankLoan', tableName: 'banks_loan' });

export default BankLoan;
