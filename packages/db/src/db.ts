import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Domain } from './entities/Domain';
import { Scan } from './entities/Scan';
import { env } from 'process';
import { config } from 'dotenv';
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env['POSTGRES_HOST'],
  port: Number(env['POSTGRES_PORT']),
  username: env['POSTGRES_USER'],
  password: env['POSTGRES_PASSWORD'],
  database: env['POSTGRES_DB'],
  entities: [Domain, Scan],
  synchronize: false,
  logging: false,
});

const initializeDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};

export default initializeDataSource;
