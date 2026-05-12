import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; bankName: string; branch: string; city: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class BankCustomer extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bankName!: string; public branch!: string; public city!: string;
}

BankCustomer.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  branch: { type: DataTypes.STRING(150), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'BankCustomer', tableName: 'banks_customer' });

export default BankCustomer;
