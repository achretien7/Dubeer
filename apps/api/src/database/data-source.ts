import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Venue } from '../venues/entities/venue.entity';
import { User } from '../users/entities/user.entity';
import { Price } from '../prices/entities/price.entity';
import { Vote } from '../votes/entities/vote.entity';

const isProduction = process.env.NODE_ENV === 'production';
console.log('[DB ENV]', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL_set: !!process.env.DATABASE_URL,
  PGHOST: process.env.PGHOST,
  PGPORT: process.env.PGPORT,
  PGUSER: process.env.PGUSER,
  PGDATABASE: process.env.PGDATABASE,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
});

const hasDatabaseUrl = !!process.env.DATABASE_URL;

// Railway (PG*) + Docker (POSTGRES_*) + local
const host = process.env.PGHOST || process.env.POSTGRES_HOST || 'localhost';
const port = Number(process.env.PGPORT || process.env.POSTGRES_PORT || 5432);
const username = process.env.PGUSER || process.env.POSTGRES_USER || 'postgres';
const password = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'postgres';
const database = process.env.PGDATABASE || process.env.POSTGRES_DB || 'dubeer';

const options: DataSourceOptions = hasDatabaseUrl
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // Railway public proxy often uses cert chains that fail strict validation
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
      extra: isProduction ? { ssl: { rejectUnauthorized: false } } : undefined,
      entities: [Venue, User, Price, Vote],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      logging: !isProduction,
    }
  : {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
      entities: [Venue, User, Price, Vote],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
      logging: true,
    };


export const AppDataSource = new DataSource(options);
export default AppDataSource;
