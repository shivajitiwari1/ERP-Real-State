import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; toEmail: string; subject: string; body?: string; status: string; error?: string; sentAt?: Date; }
interface Creation extends Optional<Attrs, 'id' | 'body' | 'error' | 'sentAt'> {}
class EmailLog extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public toEmail!: string; public subject!: string; public body?: string;
  public status!: string; public error?: string; public sentAt?: Date;
}
EmailLog.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  toEmail: { type: DataTypes.STRING(200), allowNull: false },
  subject: { type: DataTypes.STRING(500), allowNull: false },
  body: DataTypes.TEXT('long'),
  status: { type: DataTypes.ENUM('sent', 'failed'), defaultValue: 'sent' },
  error: DataTypes.TEXT,
  sentAt: DataTypes.DATE,
}, { sequelize, modelName: 'EmailLog', tableName: 'email_logs' });
export default EmailLog;
