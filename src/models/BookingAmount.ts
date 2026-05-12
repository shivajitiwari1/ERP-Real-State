import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; planId: number; amount: number; }
interface Creation extends Optional<Attrs, 'id'> {}

class BookingAmount extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public planId!: number; public amount!: number;
}

BookingAmount.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  planId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
}, { sequelize, modelName: 'BookingAmount', tableName: 'booking_amounts' });

export default BookingAmount;
