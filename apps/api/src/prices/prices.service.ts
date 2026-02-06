import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Price } from './entities/price.entity';
import { CreatePriceDto } from './dto/create-price.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PricesService {
    constructor(
        @InjectRepository(Price)
        private priceRepo: Repository<Price>,
    ) { }

    async create(createPriceDto: CreatePriceDto, userId: string | null) {
        // A2: Handle amountCents (Beer only MVP logic)
        // If amountCents is provided, use it. If amount is provided, convert.
        let amountCents = createPriceDto.amountCents;
        let amount = createPriceDto.amount;

        if (amountCents === undefined && amount !== undefined) {
            amountCents = Math.round(amount * 100);
        } else if (amount === undefined && amountCents !== undefined) {
            amount = amountCents / 100;
        }

        const price = this.priceRepo.create({
            amount: amount, // Keep sync for safe migration
            amountCents: amountCents,
            currency: 'AED', // MVP hardcoded
            beverageType: 'beer',
            format: '50cl',
            score: 0,
            venueId: createPriceDto.venueId,
            userId: userId,
        });

        return this.priceRepo.save(price);
    }




    async findByVenue(venueId: string) {
        return this.priceRepo.find({
            where: { venue: { id: venueId } },
            order: { created_at: 'DESC' },
            relations: ['user'], // Optional: if we want to show who added it
        });
    }
}
