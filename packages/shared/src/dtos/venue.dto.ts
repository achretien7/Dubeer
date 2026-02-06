export interface VenueDto {
    id: string;
    name: string;
    address?: string;
    city_area?: string;
    latitude: number;
    longitude: number;
    displayBeerPriceCents?: number;
    currency?: string;
    distance_m?: number;
}
