import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface Attrs { id: number; name: string; phoneCode?: string; }
interface Creation extends Optional<Attrs, 'id' | 'phoneCode'> {}

class Country extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string; public phoneCode?: string;
}

Country.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  phoneCode: DataTypes.STRING(10),
}, { sequelize, modelName: 'Country', tableName: 'countries' });

export default Country;
