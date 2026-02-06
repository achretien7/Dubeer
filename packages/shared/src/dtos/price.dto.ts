export interface PriceDto {
    id: string;
    amount: string; // Deprecated in favor of amountCents (display only)
    amountCents?: number;
    currency: string;
    created_at: string;
    venueId: string;
    score: number;
}
