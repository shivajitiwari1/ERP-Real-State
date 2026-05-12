import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; brokerId: number; unitId: number; projectId: number; holdDate: Date; unholdDate?: Date; status: string; }
interface Creation extends Optional<Attrs, 'id' | 'unholdDate'> {}
class HeldUnit extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public brokerId!: number; public unitId!: number; public projectId!: number;
  public holdDate!: Date; public unholdDate?: Date; public status!: string;
}
HeldUnit.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  brokerId: { type: DataTypes.INTEGER, allowNull: false },
  unitId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  holdDate: { type: DataTypes.DATEONLY, allowNull: false },
  unholdDate: DataTypes.DATEONLY,
  status: { type: DataTypes.ENUM('held', 'released'), defaultValue: 'held' },
}, { sequelize, modelName: 'HeldUnit', tableName: 'held_units' });
export default HeldUnit;
