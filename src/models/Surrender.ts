import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; bookingId: number; surrenderDate: Date; reason?: string; status: string; restoredDate?: Date; createdBy?: number; }
interface Creation extends Optional<Attrs, 'id' | 'reason' | 'restoredDate' | 'createdBy'> {}

class Surrender extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public surrenderDate!: Date;
  public reason?: string; public status!: string; public restoredDate?: Date; public createdBy?: number;
}

Surrender.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  surrenderDate: { type: DataTypes.DATEONLY, allowNull: false },
  reason: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('surrendered', 'restored'), defaultValue: 'surrendered' },
  restoredDate: DataTypes.DATEONLY,
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'Surrender', tableName: 'surrenders' });

export default Surrender;
