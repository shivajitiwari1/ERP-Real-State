import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; projectId: number; chargePerDay: number; effectiveFrom: Date; }
interface Creation extends Optional<Attrs, 'id'> {}
class HoldingCharge extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public chargePerDay!: number; public effectiveFrom!: Date;
}
HoldingCharge.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  chargePerDay: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  effectiveFrom: { type: DataTypes.DATEONLY, allowNull: false },
}, { sequelize, modelName: 'HoldingCharge', tableName: 'holding_charges' });
export default HoldingCharge;
