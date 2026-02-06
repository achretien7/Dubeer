import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('prices')
export class VotesController {
    constructor(private readonly votesService: VotesService) { }

    @Post(':id/vote')
    @UseGuards(AuthGuard('jwt'))
    async vote(@Param('id') id: string, @Body() dto: CreateVoteDto, @Request() req: any) {
        return this.votesService.vote(id, req.user, dto);
    }
}
