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
        let venue = await venueRepo.findOne({ where: { name: item.name } });
        if (!venue) {
            venue = new Venue();
            venue.name = item.name;
        }
        venue.address = item.address;
        venue.city_area = item.city_area;
        venue.location = {
            type: 'Point',
            coordinates: [item.longitude, item.latitude],
        };

        await venueRepo.save(venue);
        console.log(`Seeded: ${venue.name}`);
    }

    await app.close();
}
bootstrap();
