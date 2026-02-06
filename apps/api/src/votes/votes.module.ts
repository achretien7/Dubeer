import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { Price } from '../prices/entities/price.entity';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Vote, Price])],
    controllers: [VotesController],
    providers: [VotesService],
})
export class VotesModule { }
