import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface FloorAttributes { id: number; towerId: number; floorNumber: number; floorName: string; }
interface FloorCreation extends Optional<FloorAttributes, 'id'> {}

class Floor extends Model<FloorAttributes, FloorCreation> implements FloorAttributes {
  public id!: number; public towerId!: number; public floorNumber!: number; public floorName!: string;
}

Floor.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  towerId: { type: DataTypes.INTEGER, allowNull: false },
  floorNumber: { type: DataTypes.INTEGER, allowNull: false },
  floorName: { type: DataTypes.STRING(50), allowNull: false },
}, { sequelize, modelName: 'Floor', tableName: 'floors' });

export default Floor;
