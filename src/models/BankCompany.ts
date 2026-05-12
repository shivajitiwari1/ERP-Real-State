import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; bankName: string; accountNo: string; ifsc: string; branch: string; city: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class BankCompany extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bankName!: string; public accountNo!: string;
  public ifsc!: string; public branch!: string; public city!: string;
}

BankCompany.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  accountNo: { type: DataTypes.STRING(50), allowNull: false },
  ifsc: { type: DataTypes.STRING(20), allowNull: false },
  branch: { type: DataTypes.STRING(150), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'BankCompany', tableName: 'banks_company' });

export default BankCompany;
