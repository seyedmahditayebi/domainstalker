import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Domain } from '@repo/db/Domain';
import { Scan } from '@repo/db/Scan';
import { DomainstalkerMigration1758640128392 } from '@repo/db/1758640128392-domainstalkerMigration';
import { env } from 'process';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env['POSTGRES_HOST'],
  port: Number(env['POSTGRES_PORT']),
  username: env['POSTGRES_USER'],
  password: env['POSTGRES_PASSWORD'],
  database: env['POSTGRES_DB'],
  entities: [Domain, Scan],
  migrations: [DomainstalkerMigration1758640128392],
  synchronize: false,
  migrationsRun: true,
  logging: false,
});

await AppDataSource.initialize();

export default AppDataSource;
