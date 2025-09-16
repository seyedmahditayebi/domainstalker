import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Domain } from '@repo/db/Domain';
import { Scan } from '@repo/db/Scan';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'domainstalker',
  entities: [Domain, Scan],
  synchronize: false,
  logging: false,
});

await AppDataSource.initialize();

export default AppDataSource;
