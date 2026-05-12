import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; name: string; rate: number; }
interface Creation extends Optional<Attrs, 'id'> {}

class AddonCharge extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public name!: string; public rate!: number;
}

AddonCharge.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  rate: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
}, { sequelize, modelName: 'AddonCharge', tableName: 'addon_charges' });

export default AddonCharge;
