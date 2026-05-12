import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; planId: number; name: string; stageOrder: number; }
interface Creation extends Optional<Attrs, 'id'> {}

class PaymentStage extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public planId!: number;
  public name!: string; public stageOrder!: number;
}

PaymentStage.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  planId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  stageOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { sequelize, modelName: 'PaymentStage', tableName: 'payment_stages' });

export default PaymentStage;
