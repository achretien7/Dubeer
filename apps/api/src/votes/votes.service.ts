import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { Price } from '../prices/entities/price.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,
    @InjectRepository(Price)
    private priceRepo: Repository<Price>,
    private dataSource: DataSource,
  ) {}

  async vote(priceId: string, user: User, dto: CreateVoteDto) {
    return this.dataSource.transaction(async (manager) => {
      // Load the full Price entity (must include score)
      const price = await manager.findOne(Price, { where: { id: priceId } });
      if (!price) throw new NotFoundException('Price not found');

      // Safety: score may be null/undefined if DB not migrated or older rows exist
      if (price.score === null || price.score === undefined) {
        price.score = 0;
      }

      const existingVote = await manager.findOne(Vote, {
        where: { price: { id: priceId }, user: { id: user.id } },
      });

      if (existingVote) {
        if (existingVote.value === dto.value) {
          // Toggle off (remove vote)
          price.score -= existingVote.value;
          await manager.remove(existingVote);
          await manager.save(price);
          return { status: 'removed', score: price.score };
        } else {
          // Flip vote
          price.score = price.score - existingVote.value + dto.value;
          existingVote.value = dto.value;
          await manager.save(existingVote);
          await manager.save(price);
          return { status: 'updated', score: price.score };
        }
      }

      // New vote (use the loaded Price entity, not a partial {id})
      const newVote = manager.create(Vote, {
        value: dto.value,
        user,
        price,
      });

      price.score += dto.value;
      await manager.save(newVote);
      await manager.save(price);
      return { status: 'created', score: price.score };
    });
  }
}
