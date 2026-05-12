import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; name: string; rate: number; chargeType: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class PlcCharge extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public name!: string;
  public rate!: number; public chargeType!: string;
}

PlcCharge.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  rate: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  chargeType: { type: DataTypes.ENUM('per_sqft', 'fixed'), defaultValue: 'per_sqft' },
}, { sequelize, modelName: 'PlcCharge', tableName: 'plc_charges' });

export default PlcCharge;
