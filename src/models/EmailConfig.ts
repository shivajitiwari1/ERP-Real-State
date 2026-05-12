import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; smtpHost: string; smtpPort: number; username: string; passwordEncrypted?: string; fromEmail: string; isSsl: boolean; }
interface Creation extends Optional<Attrs, 'id' | 'passwordEncrypted'> {}
class EmailConfig extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public smtpHost!: string; public smtpPort!: number;
  public username!: string; public passwordEncrypted?: string; public fromEmail!: string; public isSsl!: boolean;
}
EmailConfig.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  smtpHost: { type: DataTypes.STRING(200), allowNull: false },
  smtpPort: { type: DataTypes.INTEGER, defaultValue: 587 },
  username: { type: DataTypes.STRING(200), allowNull: false },
  passwordEncrypted: DataTypes.TEXT,
  fromEmail: { type: DataTypes.STRING(200), allowNull: false },
  isSsl: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'EmailConfig', tableName: 'email_configs' });
export default EmailConfig;
