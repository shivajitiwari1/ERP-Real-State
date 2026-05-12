import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class UnitLocation extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public name!: string;
}

UnitLocation.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'UnitLocation', tableName: 'unit_locations' });

export default UnitLocation;
