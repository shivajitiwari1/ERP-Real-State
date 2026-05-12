import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface ProjectAttributes {
  id: number; companyId: number; projectTypeId?: number;
  name: string; code: string;
  address?: string; city?: string; state?: string; country?: string; pin?: string;
  email?: string; phone?: string; description?: string;
  startDate?: Date; possessionDate?: Date; isActive: boolean;
}
interface ProjectCreation extends Optional<ProjectAttributes, 'id' | 'projectTypeId' | 'address' | 'city' | 'state' | 'country' | 'pin' | 'email' | 'phone' | 'description' | 'startDate' | 'possessionDate'> {}

class Project extends Model<ProjectAttributes, ProjectCreation> implements ProjectAttributes {
  public id!: number; public companyId!: number; public projectTypeId?: number;
  public name!: string; public code!: string;
  public address?: string; public city?: string; public state?: string;
  public country?: string; public pin?: string; public email?: string;
  public phone?: string; public description?: string;
  public startDate?: Date; public possessionDate?: Date; public isActive!: boolean;
}

Project.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  companyId: { type: DataTypes.INTEGER, allowNull: false },
  projectTypeId: DataTypes.INTEGER,
  name: { type: DataTypes.STRING(200), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  address: DataTypes.TEXT,
  city: DataTypes.STRING(100),
  state: DataTypes.STRING(100),
  country: DataTypes.STRING(100),
  pin: DataTypes.STRING(20),
  email: DataTypes.STRING(150),
  phone: DataTypes.STRING(50),
  description: DataTypes.TEXT,
  startDate: DataTypes.DATEONLY,
  possessionDate: DataTypes.DATEONLY,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'Project', tableName: 'projects' });

export default Project;
