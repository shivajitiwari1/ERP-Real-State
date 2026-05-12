import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; fromBookingId: number; toUnitId: number; shiftDate: Date; reason?: string; createdBy?: number; }
interface Creation extends Optional<Attrs, 'id' | 'reason' | 'createdBy'> {}

class UnitShift extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public fromBookingId!: number; public toUnitId!: number;
  public shiftDate!: Date; public reason?: string; public createdBy?: number;
}

UnitShift.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fromBookingId: { type: DataTypes.INTEGER, allowNull: false },
  toUnitId: { type: DataTypes.INTEGER, allowNull: false },
  shiftDate: { type: DataTypes.DATEONLY, allowNull: false },
  reason: DataTypes.TEXT,
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'UnitShift', tableName: 'unit_shifts' });

export default UnitShift;
