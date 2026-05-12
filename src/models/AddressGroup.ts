import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}
class AddressGroup extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string;
}
AddressGroup.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'AddressGroup', tableName: 'address_groups' });
export default AddressGroup;
