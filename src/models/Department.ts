import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface DeptAttributes { id: number; name: string; }
interface DeptCreation extends Optional<DeptAttributes, 'id'> {}

class Department extends Model<DeptAttributes, DeptCreation> implements DeptAttributes {
  public id!: number; public name!: string;
}

Department.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { sequelize, modelName: 'Department', tableName: 'departments' });

export default Department;
