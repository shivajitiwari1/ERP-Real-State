import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; planId: number; stageId?: number; name: string;
  dueType: string; dueDate?: Date; percentage: number; amount: number;
}
interface Creation extends Optional<Attrs, 'id' | 'stageId' | 'dueDate'> {}

class Installment extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public planId!: number; public stageId?: number;
  public name!: string; public dueType!: string; public dueDate?: Date;
  public percentage!: number; public amount!: number;
}

Installment.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  planId: { type: DataTypes.INTEGER, allowNull: false },
  stageId: DataTypes.INTEGER,
  name: { type: DataTypes.STRING(200), allowNull: false },
  dueType: { type: DataTypes.ENUM('date', 'milestone', 'on_booking'), defaultValue: 'date' },
  dueDate: DataTypes.DATEONLY,
  percentage: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
}, { sequelize, modelName: 'Installment', tableName: 'installments' });

export default Installment;
