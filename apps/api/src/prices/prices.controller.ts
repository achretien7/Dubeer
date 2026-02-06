import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPriceDto: CreatePriceDto, @Request() req: ExpressRequest) {
    const jwtUser = (req as any).user;
    const userId = (req as any).user.userId;
return this.pricesService.create(createPriceDto, userId);

  }
}
