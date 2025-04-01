import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

const DB_NAME = process.env.VITE_ENV === 'test'
  ? process.env.DB_TEST
  : process.env.DB_APP;

const sequelize = new Sequelize(DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

export default sequelize;