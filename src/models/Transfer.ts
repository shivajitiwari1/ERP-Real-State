import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; fromBookingId: number; toBookingId?: number; transferDate: Date;
  transferFee: number; serviceTax: number; status: string; createdBy?: number;
}
interface Creation extends Optional<Attrs, 'id' | 'toBookingId' | 'createdBy'> {}

class Transfer extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public fromBookingId!: number; public toBookingId?: number;
  public transferDate!: Date; public transferFee!: number; public serviceTax!: number;
  public status!: string; public createdBy?: number;
}

Transfer.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fromBookingId: { type: DataTypes.INTEGER, allowNull: false },
  toBookingId: DataTypes.INTEGER,
  transferDate: { type: DataTypes.DATEONLY, allowNull: false },
  transferFee: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  serviceTax: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' },
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'Transfer', tableName: 'transfers' });

export default Transfer;
