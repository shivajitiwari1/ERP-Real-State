import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs {
  id: number; projectId: number;
  bookingAuthType: string; receiptNoPrefix: string;
  registrationNoPrefix: string; transferAuthType: string;
}
interface Creation extends Optional<Attrs, 'id'> {}

class ProjectConfiguration extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public projectId!: number;
  public bookingAuthType!: string; public receiptNoPrefix!: string;
  public registrationNoPrefix!: string; public transferAuthType!: string;
}

ProjectConfiguration.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  bookingAuthType: { type: DataTypes.STRING(20), defaultValue: 'auto' },
  receiptNoPrefix: { type: DataTypes.STRING(20), defaultValue: 'REC' },
  registrationNoPrefix: { type: DataTypes.STRING(20), defaultValue: 'REG' },
  transferAuthType: { type: DataTypes.STRING(20), defaultValue: 'auto' },
}, { sequelize, modelName: 'ProjectConfiguration', tableName: 'project_configurations' });

export default ProjectConfiguration;
