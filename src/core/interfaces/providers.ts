export interface GeoProvider {
    getCoordinates(address: string): Promise<{ lat: number; lng: number }>;
}