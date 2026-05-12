import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; receiptId: number; headName: string; amount: number; taxAmount: number; }
interface Creation extends Optional<Attrs, 'id'> {}

class ReceiptHead extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public receiptId!: number; public headName!: string;
  public amount!: number; public taxAmount!: number;
}

ReceiptHead.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  receiptId: { type: DataTypes.INTEGER, allowNull: false },
  headName: { type: DataTypes.STRING(200), allowNull: false },
  amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  taxAmount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
}, { sequelize, modelName: 'ReceiptHead', tableName: 'receipt_heads' });

export default ReceiptHead;
