import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; name: string; content: string; headFormat?: string; }
interface Creation extends Optional<Attrs, 'id' | 'headFormat'> {}

class LetterTemplate extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string; public content!: string; public headFormat?: string;
}

LetterTemplate.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  headFormat: DataTypes.TEXT,
}, { sequelize, modelName: 'LetterTemplate', tableName: 'letter_templates' });

export default LetterTemplate;
