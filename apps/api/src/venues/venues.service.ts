import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';

@Injectable()
export class VenuesService {
    constructor(
        @InjectRepository(Venue)
        private repo: Repository<Venue>,
    ) { }

    async findNearby(lat: number, lon: number, radius: number, limit: number) {
        const rawData = await this.repo
            .createQueryBuilder('venue')
            .addSelect('ST_Distance(venue.location, ST_MakePoint(:lon, :lat)::geography)', 'distance_m')
            .where('ST_DWithin(venue.location, ST_MakePoint(:lon, :lat)::geography, :radius)')
            .orderBy('distance_m', 'ASC')
            .setParameters({ lat, lon, radius })
            .limit(limit)
            .getRawAndEntities();

        // Merge distance into entity or return DTO
        return rawData.entities.map((venue, index) => {
            const distance = rawData.raw[index].distance_m;
            // Flatten geojson for easier consumption
            const latitude = (venue.location as any).coordinates[1];
            const longitude = (venue.location as any).coordinates[0];

            return {
                ...venue,
                latitude,
                longitude,
                distance_m: distance,
            };
        });
    }
}
