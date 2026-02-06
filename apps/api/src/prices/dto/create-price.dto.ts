import { IsNumber, IsNotEmpty, Min, IsUUID } from 'class-validator';

export class CreatePriceDto {
    @IsNotEmpty()
    @IsUUID()
    venueId: string;

    @IsNumber()
    @Min(0.01)
    amount: number;
}
