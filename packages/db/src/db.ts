import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Domain } from './entities/Domain';
import { Scan } from './entities/Scan';

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

export default AppDataSource;
