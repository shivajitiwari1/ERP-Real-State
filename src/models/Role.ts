import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface RoleAttributes { id: number; name: string; description?: string; }
interface RoleCreation extends Optional<RoleAttributes, 'id' | 'description'> {}

class Role extends Model<RoleAttributes, RoleCreation> implements RoleAttributes {
  public id!: number; public name!: string; public description?: string;
}

Role.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: DataTypes.TEXT,
}, { sequelize, modelName: 'Role', tableName: 'roles' });

export default Role;
