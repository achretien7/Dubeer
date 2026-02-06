import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';

@Module({
    imports: [TypeOrmModule.forFeature([Price])],
    controllers: [PricesController],
    providers: [PricesService],
    exports: [PricesService],
})
export class PricesModule { }
