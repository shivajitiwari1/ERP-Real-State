import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; name: string; rate: number; chargeType: string; isMandatory: boolean; }
interface Creation extends Optional<Attrs, 'id'> {}

class OtherCharge extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public name!: string;
  public rate!: number; public chargeType!: string; public isMandatory!: boolean;
}

OtherCharge.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  rate: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  chargeType: { type: DataTypes.ENUM('per_sqft', 'fixed'), defaultValue: 'fixed' },
  isMandatory: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'OtherCharge', tableName: 'other_charges' });

export default OtherCharge;
