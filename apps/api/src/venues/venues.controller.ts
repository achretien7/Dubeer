import { Controller, Get, Post, Body, Query, ValidationPipe, Param, UseGuards, Request } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { GetVenuesDto } from './dto/get-venues.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { PricesService } from '../prices/prices.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Add auth later if needed

@Controller('venues')
export class VenuesController {
    constructor(
        private readonly venuesService: VenuesService,
        private readonly pricesService: PricesService
    ) { }

    @Post()
    // @UseGuards(JwtAuthGuard) // Uncomment when auth is ready for this flow
    async create(@Body(new ValidationPipe()) createVenueDto: CreateVenueDto, @Request() req: any) {
        // For MVP without forced auth on Add Bar, we might use a dummy user ID or require auth
        // Assuming public for now or we use a seed user ID. 
        // Let's assume we need a user ID. If not auth, we need a strategy.
        // For Sprint A, let's use a hardcoded system user ID or similar if req.user is missing.
        const userId = req.user?.userId || '00000000-0000-0000-0000-000000000000'; // Fallback
        return this.venuesService.create(createVenueDto, userId);
    }

    @Get('nearby')
    async getNearby(@Query(new ValidationPipe({ transform: true })) query: GetVenuesDto) {
        return this.venuesService.findNearby(query.lat, query.lon, query.radius_m, query.limit);
    }

    @Get(':id/prices')
    async getPrices(@Param('id') id: string) {
        return this.pricesService.findByVenue(id);
    }
}
