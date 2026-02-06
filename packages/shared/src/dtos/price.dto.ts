export interface PriceDto {
    id: string;
    amount: string; // Decimal often comes as string
    currency: string;
    created_at: string;
    venueId?: string;
    score: number;
}
