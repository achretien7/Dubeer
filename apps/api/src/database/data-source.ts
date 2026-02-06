import { DataSource, DataSourceOptions } from 'typeorm';
import { Venue } from '../venues/entities/venue.entity';
import { User } from '../users/entities/user.entity';
import { Price } from '../prices/entities/price.entity';
import { Vote } from '../votes/entities/vote.entity';

// T28: Support DATABASE_URL for cloud deployment (Railway/Render)
const isProduction = process.env.NODE_ENV === 'production';

const options: DataSourceOptions = process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false, // Common requirement for managed DBs
        entities: [Venue, User, Price, Vote],
        migrations: ['dist/migrations/*.js'],
        synchronize: false, // Always false in prod
        logging: !isProduction,
    }
    : {
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'dubeer',
        synchronize: false,
        logging: true,
        entities: [Venue, User, Price, Vote],
        migrations: ['dist/migrations/*.js'],
    };

export const AppDataSource = new DataSource(options);
