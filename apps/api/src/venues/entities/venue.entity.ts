import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import type { Point } from 'geojson';

@Entity()
export class Venue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city_area: string;

    @Index({ spatial: true })
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location: Point;
}
