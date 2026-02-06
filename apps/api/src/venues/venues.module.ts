import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { VenuesController } from './venues.controller';
import { VenuesService } from './venues.service';
import { Price } from '../prices/entities/price.entity';
import { PricesModule } from '../prices/prices.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Venue, Price]),
        PricesModule
    ],
    controllers: [VenuesController],
    providers: [VenuesService],
    exports: [VenuesService],
})
export class VenuesModule { }
