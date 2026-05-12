import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; apiUrl: string; apiKey: string; senderId: string; }
interface Creation extends Optional<Attrs, 'id'> {}
class SmsConfig extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public apiUrl!: string; public apiKey!: string; public senderId!: string;
}
SmsConfig.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  apiUrl: { type: DataTypes.STRING(500), allowNull: false },
  apiKey: { type: DataTypes.STRING(200), allowNull: false },
  senderId: { type: DataTypes.STRING(20), allowNull: false },
}, { sequelize, modelName: 'SmsConfig', tableName: 'sms_configs' });
export default SmsConfig;
