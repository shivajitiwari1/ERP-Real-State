import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface DemandAttributes {
  id: number; bookingId: number; projectId: number;
  installmentId?: number; stageId?: number;
  demandDate: Date; dueDate?: Date;
  amount: number; taxAmount: number; totalAmount: number;
  demandType: string; status: string; sentDate?: Date;
}
interface DemandCreation extends Optional<DemandAttributes, 'id' | 'installmentId' | 'stageId' | 'dueDate' | 'sentDate'> {}

class Demand extends Model<DemandAttributes, DemandCreation> implements DemandAttributes {
  public id!: number; public bookingId!: number; public projectId!: number;
  public installmentId?: number; public stageId?: number;
  public demandDate!: Date; public dueDate?: Date;
  public amount!: number; public taxAmount!: number; public totalAmount!: number;
  public demandType!: string; public status!: string; public sentDate?: Date;
}

Demand.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  installmentId: DataTypes.INTEGER,
  stageId: DataTypes.INTEGER,
  demandDate: { type: DataTypes.DATEONLY, allowNull: false },
  dueDate: DataTypes.DATEONLY,
  amount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  taxAmount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  demandType: { type: DataTypes.ENUM('stage', 'tower', 'customer', 'installment'), defaultValue: 'stage' },
  status: { type: DataTypes.ENUM('pending', 'sent', 'r1', 'r2', 'r3', 'r4', 'termination', 'settled'), defaultValue: 'pending' },
  sentDate: DataTypes.DATEONLY,
}, { sequelize, modelName: 'Demand', tableName: 'demands' });

export default Demand;
