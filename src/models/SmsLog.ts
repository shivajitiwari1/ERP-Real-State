import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; mobile: string; message: string; status: string; sentAt?: Date; }
interface Creation extends Optional<Attrs, 'id' | 'sentAt'> {}
class SmsLog extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public mobile!: string; public message!: string;
  public status!: string; public sentAt?: Date;
}
SmsLog.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  mobile: { type: DataTypes.STRING(20), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('sent', 'failed'), defaultValue: 'sent' },
  sentAt: DataTypes.DATE,
}, { sequelize, modelName: 'SmsLog', tableName: 'sms_logs' });
export default SmsLog;
