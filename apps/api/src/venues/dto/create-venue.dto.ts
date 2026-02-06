import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateVenueDto {
    @IsNotEmpty()
    @MinLength(2)
    @IsString()
    name: string;

    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    city_area?: string;

    @IsNotEmpty()
    @IsNumber()
    lat: number;

    @IsNotEmpty()
    @IsNumber()
    lon: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    beerPriceCents: number;

    @IsOptional()
    @IsString()
    currency?: string;
}
