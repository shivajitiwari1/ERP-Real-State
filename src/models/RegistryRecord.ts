import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; bookingId: number; registryDate: Date; stampDuty: number; registrationCharges: number; total: number; remarks?: string; }
interface Creation extends Optional<Attrs, 'id' | 'remarks'> {}
class RegistryRecord extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public registryDate!: Date;
  public stampDuty!: number; public registrationCharges!: number; public total!: number; public remarks?: string;
}
RegistryRecord.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  registryDate: { type: DataTypes.DATEONLY, allowNull: false },
  stampDuty: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  registrationCharges: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  remarks: DataTypes.TEXT,
}, { sequelize, modelName: 'RegistryRecord', tableName: 'registry_records' });
export default RegistryRecord;
