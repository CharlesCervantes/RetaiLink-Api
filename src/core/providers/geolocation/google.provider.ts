import axios from 'axios';
import { GeoProvider } from '../../../core/interfaces';

export class GoogleProvider implements GeoProvider {
  constructor(private apiKey: string) {}

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const encoded = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${this.apiKey}`;
    const { data } = await axios.get(url);

    const location = data.results[0]?.geometry.location;
    return { lat: location.lat, lng: location.lng };
  }
}
