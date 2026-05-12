import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; groupId?: number; name: string; email?: string; mobile?: string; address?: string; }
interface Creation extends Optional<Attrs, 'id' | 'groupId' | 'email' | 'mobile' | 'address'> {}
class AddressBook extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public groupId?: number; public name!: string;
  public email?: string; public mobile?: string; public address?: string;
}
AddressBook.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  groupId: DataTypes.INTEGER,
  name: { type: DataTypes.STRING(200), allowNull: false },
  email: DataTypes.STRING(200),
  mobile: DataTypes.STRING(20),
  address: DataTypes.TEXT,
}, { sequelize, modelName: 'AddressBook', tableName: 'address_book' });
export default AddressBook;
