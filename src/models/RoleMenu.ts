import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface RoleMenuAttributes {
  id: number; roleId: number; pageUrl: string; pageName: string;
  category: string; canView: boolean;
}
interface RoleMenuCreation extends Optional<RoleMenuAttributes, 'id'> {}

class RoleMenu extends Model<RoleMenuAttributes, RoleMenuCreation> implements RoleMenuAttributes {
  public id!: number; public roleId!: number; public pageUrl!: string;
  public pageName!: string; public category!: string; public canView!: boolean;
}

RoleMenu.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  pageUrl: { type: DataTypes.STRING(200), allowNull: false },
  pageName: { type: DataTypes.STRING(200), allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: false },
  canView: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'RoleMenu', tableName: 'role_menus' });

export default RoleMenu;
