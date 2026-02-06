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

    async create(createPriceDto: CreatePriceDto, userId: string) {
  const price = this.priceRepo.create({
    amount: createPriceDto.amount,
    currency: 'AED',
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
