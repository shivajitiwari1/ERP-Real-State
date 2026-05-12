import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; projectId: number; name: string;
  planType: string; discountType: string;
  discountValue: number; is100Percent: boolean; description?: string;
}
interface Creation extends Optional<Attrs, 'id' | 'description'> {}

class PaymentPlan extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public name!: string;
  public planType!: string; public discountType!: string;
  public discountValue!: number; public is100Percent!: boolean; public description?: string;
}

PaymentPlan.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  planType: { type: DataTypes.ENUM('flexi', 'regular', 'construction'), defaultValue: 'regular' },
  discountType: { type: DataTypes.ENUM('percent', 'per_area'), defaultValue: 'percent' },
  discountValue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  is100Percent: { type: DataTypes.BOOLEAN, defaultValue: false },
  description: DataTypes.TEXT,
}, { sequelize, modelName: 'PaymentPlan', tableName: 'payment_plans' });

export default PaymentPlan;
