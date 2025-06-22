import axios from 'axios';
import { GeoProvider } from '../../../core/interfaces';

export class NominatimProvider implements GeoProvider {
  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;

    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'my-app@example.com' }
    });

    const location = data[0];
    return { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
  }
}
