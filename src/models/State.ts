import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; countryId: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class State extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public countryId!: number; public name!: string;
}

State.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  countryId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'State', tableName: 'states' });

export default State;
