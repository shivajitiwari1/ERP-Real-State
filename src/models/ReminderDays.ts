import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; projectId: number;
  r1Days: number; r2Days: number; r3Days: number; r4Days: number; terminationDays: number;
}
interface Creation extends Optional<Attrs, 'id'> {}

class ReminderDays extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number;
  public r1Days!: number; public r2Days!: number; public r3Days!: number;
  public r4Days!: number; public terminationDays!: number;
}

ReminderDays.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  r1Days: { type: DataTypes.INTEGER, defaultValue: 7 },
  r2Days: { type: DataTypes.INTEGER, defaultValue: 15 },
  r3Days: { type: DataTypes.INTEGER, defaultValue: 30 },
  r4Days: { type: DataTypes.INTEGER, defaultValue: 45 },
  terminationDays: { type: DataTypes.INTEGER, defaultValue: 60 },
}, { sequelize, modelName: 'ReminderDays', tableName: 'reminder_days' });

export default ReminderDays;
