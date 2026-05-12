import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; bookingId: number; projectId: number; entryDate: Date;
  amount: number; entryType: string; narration?: string; createdBy?: number;
}
interface Creation extends Optional<Attrs, 'id' | 'narration' | 'createdBy'> {}

class JournalEntry extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public projectId!: number;
  public entryDate!: Date; public amount!: number; public entryType!: string;
  public narration?: string; public createdBy?: number;
}

JournalEntry.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  entryDate: { type: DataTypes.DATEONLY, allowNull: false },
  amount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
  entryType: { type: DataTypes.ENUM('JV', 'DR', 'CR', 'Refund'), defaultValue: 'JV' },
  narration: DataTypes.TEXT,
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'JournalEntry', tableName: 'journal_entries' });

export default JournalEntry;
