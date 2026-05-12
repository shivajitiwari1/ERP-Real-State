import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; unitTypeId?: number; ratePerSqft: number; effectiveDate?: Date; }
interface Creation extends Optional<Attrs, 'id' | 'unitTypeId' | 'effectiveDate'> {}

class Rate extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public unitTypeId?: number;
  public ratePerSqft!: number; public effectiveDate?: Date;
}

Rate.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  unitTypeId: DataTypes.INTEGER,
  ratePerSqft: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  effectiveDate: DataTypes.DATEONLY,
}, { sequelize, modelName: 'Rate', tableName: 'rates' });

export default Rate;
