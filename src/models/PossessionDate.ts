import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; projectId: number; towerId?: number; unitId?: number; bookingId: number; expectedDate?: Date; actualDate?: Date; }
interface Creation extends Optional<Attrs, 'id' | 'towerId' | 'unitId' | 'expectedDate' | 'actualDate'> {}
class PossessionDate extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public towerId?: number; public unitId?: number;
  public bookingId!: number; public expectedDate?: Date; public actualDate?: Date;
}
PossessionDate.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  towerId: DataTypes.INTEGER,
  unitId: DataTypes.INTEGER,
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  expectedDate: DataTypes.DATEONLY,
  actualDate: DataTypes.DATEONLY,
}, { sequelize, modelName: 'PossessionDate', tableName: 'possession_dates' });
export default PossessionDate;
