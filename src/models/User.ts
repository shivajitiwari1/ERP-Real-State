import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface UserAttributes {
  id: number; employeeId: number; username: string;
  passwordHash: string; roleId: number; isActive: boolean; lastLogin?: Date;
}
interface UserCreation extends Optional<UserAttributes, 'id' | 'lastLogin'> {}

class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: number; public employeeId!: number; public username!: string;
  public passwordHash!: string; public roleId!: number;
  public isActive!: boolean; public lastLogin?: Date;
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  employeeId: { type: DataTypes.INTEGER, allowNull: false },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: DataTypes.DATE,
}, { sequelize, modelName: 'User', tableName: 'users' });

export default User;
