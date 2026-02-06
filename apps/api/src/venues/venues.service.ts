import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { Price } from '../prices/entities/price.entity'; // Direct access for QueryBuilder/Tx
import { CreateVenueDto } from './dto/create-venue.dto';

@Injectable()
export class VenuesService {
    constructor(
        @InjectRepository(Venue)
        private repo: Repository<Venue>,
        @InjectRepository(Price)
        private priceRepo: Repository<Price>,
    ) { }

    async create(dto: CreateVenueDto, userId: string | null) {
        // 1. Create Venue
        const venue = this.repo.create({
            name: dto.name,
            address: dto.address,
            city_area: dto.city_area,
            location: {
                type: 'Point',
                coordinates: [dto.lon, dto.lat],
            }
        });
        const savedVenue = await this.repo.save(venue);

        // 2. Create Initial Price
        const price = this.priceRepo.create({
            venueId: savedVenue.id,
            amountCents: dto.beerPriceCents,
            amount: dto.beerPriceCents / 100, // Sync
            currency: dto.currency || 'AED',
            beverageType: 'beer',
            format: '50cl',
            userId: userId, // Can be null now
        });
        await this.priceRepo.save(price);

        return {
            ...savedVenue,
            latitude: dto.lat,
            longitude: dto.lon, // Return input coords for simplified response
            displayBeerPriceCents: dto.beerPriceCents,
            currency: price.currency,
        };
    }

    async findNearby(lat: number, lon: number, radius: number, limit: number) {
        const rawData = await this.repo
            .createQueryBuilder('venue')
            .addSelect('ST_Distance(venue.location, ST_MakePoint(:lon, :lat)::geography)', 'distance_m')
            // Subquery for latest beer price
            .addSelect(subQuery => {
                return subQuery
                    .select('price.amountCents')
                    .from(Price, 'price')
                    .where('price.venueId = venue.id')
                    .andWhere("price.beverageType = 'beer'") // Beer only
                    .orderBy('price.created_at', 'DESC')
                    .limit(1);
            }, 'display_price_cents')
            .where('ST_DWithin(venue.location, ST_MakePoint(:lon, :lat)::geography, :radius)')
            .orderBy('distance_m', 'ASC')
            .setParameters({ lat, lon, radius })
            .limit(limit)
            .getRawAndEntities();

        // Merge distance & price into DTO
        return rawData.entities.map((venue, index) => {
            const raw = rawData.raw[index];
            const distance = raw.distance_m;
            const priceCents = raw.display_price_cents; // lowercase from raw query?

            // Flatten geojson
            const latitude = (venue.location as any).coordinates[1];
            const longitude = (venue.location as any).coordinates[0];

            return {
                id: venue.id,
                name: venue.name,
                address: venue.address,
                city_area: venue.city_area,
                latitude,
                longitude,
                distance_m: distance,
                displayBeerPriceCents: priceCents,
                currency: 'AED', // Hardcoded MVP
            };
        });
    }
}
