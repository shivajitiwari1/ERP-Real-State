import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

export type UnitStatus = 'available' | 'booked' | 'sold' | 'cancelled' | 'held';

interface UnitAttributes {
  id: number; projectId: number; towerId: number; floorId: number;
  unitTypeId?: number; unitNumber: string; addressId?: number;
  locationId?: number; area?: number; status: UnitStatus;
}
interface UnitCreation extends Optional<UnitAttributes, 'id' | 'unitTypeId' | 'addressId' | 'locationId' | 'area'> {}

class Unit extends Model<UnitAttributes, UnitCreation> implements UnitAttributes {
  public id!: number; public projectId!: number; public towerId!: number;
  public floorId!: number; public unitTypeId?: number; public unitNumber!: string;
  public addressId?: number; public locationId?: number; public area?: number;
  public status!: UnitStatus;
}

Unit.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  towerId: { type: DataTypes.INTEGER, allowNull: false },
  floorId: { type: DataTypes.INTEGER, allowNull: false },
  unitTypeId: DataTypes.INTEGER,
  unitNumber: { type: DataTypes.STRING(50), allowNull: false },
  addressId: DataTypes.INTEGER,
  locationId: DataTypes.INTEGER,
  area: DataTypes.DECIMAL(10, 2),
  status: { type: DataTypes.ENUM('available', 'booked', 'sold', 'cancelled', 'held'), defaultValue: 'available' },
}, { sequelize, modelName: 'Unit', tableName: 'units' });

export default Unit;
