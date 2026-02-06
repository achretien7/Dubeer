import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePriceDto {
    @IsUUID()
    venueId: string;

    @IsOptional() // Deprecated
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsNumber()
    amountCents?: number;
}
