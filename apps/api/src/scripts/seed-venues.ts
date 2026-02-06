import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Venue } from '../venues/entities/venue.entity';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const venueRepo = dataSource.getRepository(Venue);

    const seedFile = path.resolve(__dirname, '../../../../docs/sprint-1/venues.seed.json');
    console.log(`Reading seed from: ${seedFile}`);

    if (!fs.existsSync(seedFile)) {
        console.error('Seed file not found!');
        process.exit(1);
    }

    const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));

    for (const item of seedData) {
        const existingVenue = await venueRepo.findOne({ where: { name: item.name } });

        if (existingVenue) {
            await venueRepo
                .createQueryBuilder()
                .update(Venue)
                .set({
                    address: item.address,
                    city_area: item.city_area,
                    location: () => `ST_SetSRID(ST_MakePoint(${item.lon}, ${item.lat}), 4326)::geography`
                })
                .where("id = :id", { id: existingVenue.id })
                .execute();
            console.log(`Updated: ${item.name}`);
        } else {
            await venueRepo
                .createQueryBuilder()
                .insert()
                .into(Venue)
                .values({
                    name: item.name,
                    address: item.address,
                    city_area: item.city_area,
                    location: () => `ST_SetSRID(ST_MakePoint(${item.lon}, ${item.lat}), 4326)::geography`
                })
                .execute();
            console.log(`Seeded: ${item.name}`);
        }
    }

    await app.close();
}
bootstrap();
