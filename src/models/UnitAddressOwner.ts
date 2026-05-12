import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; projectId: number; ownerName: string; address?: string; }
interface Creation extends Optional<Attrs, 'id' | 'address'> {}

class UnitAddressOwner extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number; public ownerName!: string; public address?: string;
}

UnitAddressOwner.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  ownerName: { type: DataTypes.STRING(200), allowNull: false },
  address: DataTypes.TEXT,
}, { sequelize, modelName: 'UnitAddressOwner', tableName: 'unit_address_owners' });

export default UnitAddressOwner;
