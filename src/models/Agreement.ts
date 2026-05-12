import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; bookingId: number; agreementDate: Date;
  agreementType: string; status: string; createdBy?: number;
}
interface Creation extends Optional<Attrs, 'id' | 'createdBy'> {}

class Agreement extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public agreementDate!: Date;
  public agreementType!: string; public status!: string; public createdBy?: number;
}

Agreement.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  agreementDate: { type: DataTypes.DATEONLY, allowNull: false },
  agreementType: { type: DataTypes.ENUM('provisional', 'allotment', 'bba', 'tpa'), defaultValue: 'allotment' },
  status: { type: DataTypes.ENUM('active', 'cancelled'), defaultValue: 'active' },
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'Agreement', tableName: 'agreements' });

export default Agreement;
