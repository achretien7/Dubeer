import { Controller, Get, Query, ValidationPipe, Param } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { GetVenuesDto } from './dto/get-venues.dto';
import { PricesService } from '../prices/prices.service';

@Controller('venues')
export class VenuesController {
    constructor(
        private readonly venuesService: VenuesService,
        private readonly pricesService: PricesService
    ) { }

    @Get('nearby')
    async getNearby(@Query(new ValidationPipe({ transform: true })) query: GetVenuesDto) {
        return this.venuesService.findNearby(query.lat, query.lon, query.radius_m, query.limit);
    }

    @Get(':id/prices')
    async getPrices(@Param('id') id: string) {
        // Check if venue exists? Optional for MVP
        return this.pricesService.findByVenue(id);
    }
}
