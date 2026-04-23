import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config(); // .env load

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: false, // production always false
  logging: process.env.DB_LOGGING === 'true',
};

// DataSource for run Migration
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
