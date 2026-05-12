import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; name: string; total: number; rate: number; }
interface Creation extends Optional<Attrs, 'id'> {}

class ParkingType extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public name!: string;
  public total!: number; public rate!: number;
}

ParkingType.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  total: { type: DataTypes.INTEGER, defaultValue: 0 },
  rate: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
}, { sequelize, modelName: 'ParkingType', tableName: 'parking_types' });

export default ParkingType;
