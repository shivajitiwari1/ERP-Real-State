import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; name: string; symbol: string; exchangeRate: number; }
interface Creation extends Optional<Attrs, 'id'> {}

class Currency extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string; public symbol!: string; public exchangeRate!: number;
}

Currency.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  symbol: { type: DataTypes.STRING(10), allowNull: false },
  exchangeRate: { type: DataTypes.DECIMAL(10, 4), defaultValue: 1 },
}, { sequelize, modelName: 'Currency', tableName: 'currencies' });

export default Currency;
