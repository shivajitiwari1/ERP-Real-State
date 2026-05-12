import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; bookingId: number; requestDate: Date; status: string; approvedDate?: Date; remarks?: string; }
interface Creation extends Optional<Attrs, 'id' | 'approvedDate' | 'remarks'> {}
class NocRequest extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public requestDate!: Date;
  public status!: string; public approvedDate?: Date; public remarks?: string;
}
NocRequest.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  requestDate: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  approvedDate: DataTypes.DATEONLY,
  remarks: DataTypes.TEXT,
}, { sequelize, modelName: 'NocRequest', tableName: 'noc_requests' });
export default NocRequest;
