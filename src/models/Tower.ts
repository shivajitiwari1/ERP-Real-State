import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface TowerAttributes { id: number; projectId: number; name: string; code: string; totalFloors: number; }
interface TowerCreation extends Optional<TowerAttributes, 'id'> {}

class Tower extends Model<TowerAttributes, TowerCreation> implements TowerAttributes {
  public id!: number; public projectId!: number; public name!: string;
  public code!: string; public totalFloors!: number;
}

Tower.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false },
  totalFloors: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { sequelize, modelName: 'Tower', tableName: 'towers' });

export default Tower;
