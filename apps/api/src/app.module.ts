import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Venue } from './venues/entities/venue.entity';
import { AppDataSource } from './database/data-source';
import { VenuesModule } from './venues/venues.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PricesModule } from './prices/prices.module';
import { VotesModule } from './votes/votes.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    VenuesModule,
    AuthModule,
    UsersModule,
    PricesModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
