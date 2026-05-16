import { Sequelize } from 'sequelize';
import 'mysql2'; // explicit import — forces Vercel NFT bundler to include mysql2

const isLocal = (process.env.DB_HOST || 'localhost') === 'localhost';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, underscored: true },
    dialectOptions: isLocal ? {} : { ssl: { rejectUnauthorized: false } },
  }
);

export default sequelize;
