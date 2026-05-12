import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class AreaType extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string;
}

AreaType.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { sequelize, modelName: 'AreaType', tableName: 'area_types' });

export default AreaType;
