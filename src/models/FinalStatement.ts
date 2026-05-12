import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; bookingId: number; totalCost: number; totalPaid: number; balance: number; generatedDate: Date; }
interface Creation extends Optional<Attrs, 'id'> {}
class FinalStatement extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public bookingId!: number; public totalCost!: number;
  public totalPaid!: number; public balance!: number; public generatedDate!: Date;
}
FinalStatement.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  totalCost: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  totalPaid: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  balance: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  generatedDate: { type: DataTypes.DATEONLY, allowNull: false },
}, { sequelize, modelName: 'FinalStatement', tableName: 'final_statements' });
export default FinalStatement;
