import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; brokerId: number; projectId: number; commissionRate: number; }
interface Creation extends Optional<Attrs, 'id'> {}
class BrokerProjectMapping extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public brokerId!: number; public projectId!: number; public commissionRate!: number;
}
BrokerProjectMapping.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  brokerId: { type: DataTypes.INTEGER, allowNull: false },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  commissionRate: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
}, { sequelize, modelName: 'BrokerProjectMapping', tableName: 'broker_project_mappings' });
export default BrokerProjectMapping;
