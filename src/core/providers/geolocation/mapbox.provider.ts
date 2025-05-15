import axios from 'axios';
import { GeoProvider } from '@/core/interfaces';

export class MapboxProvider implements GeoProvider {
  constructor(private token: string) {}

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const encoded = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${this.token}`;

    const { data } = await axios.get(url);
    const coords = data.features[0]?.center;
    return { lng: coords[0], lat: coords[1] };
  }
}
