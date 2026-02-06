import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetVenuesDto {
    @IsNumber()
    @Type(() => Number)
    @Min(-90)
    @Max(90)
    lat: number;

    @IsNumber()
    @Type(() => Number)
    @Min(-180)
    @Max(180)
    lon: number;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    radius_m: number = 5000;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    limit: number = 20;
}
