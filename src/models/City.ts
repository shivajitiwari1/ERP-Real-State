import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; stateId: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}

class City extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public stateId!: number; public name!: string;
}

City.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  stateId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'City', tableName: 'cities' });

export default City;
