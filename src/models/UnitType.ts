import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface UnitTypeAttributes { id: number; projectId: number; name: string; area: number; areaTypeId?: number; }
interface UnitTypeCreation extends Optional<UnitTypeAttributes, 'id' | 'areaTypeId'> {}

class UnitType extends Model<UnitTypeAttributes, UnitTypeCreation> implements UnitTypeAttributes {
  public id!: number; public projectId!: number; public name!: string;
  public area!: number; public areaTypeId?: number;
}

UnitType.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  area: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  areaTypeId: DataTypes.INTEGER,
}, { sequelize, modelName: 'UnitType', tableName: 'unit_types' });

export default UnitType;
