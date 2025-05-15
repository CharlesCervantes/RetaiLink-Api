import { GeoProvider } from '@/core/interfaces';
import { GoogleProvider } from '@/core/providers/geolocation/google.provider';
import { NominatimProvider } from '@/core/providers/geolocation/nominatim.provider';
import { MapboxProvider } from '@/core/providers/geolocation/mapbox.provider';

export type ProviderType = 'google' | 'nominatim' | 'mapbox';

export class GeolocationFactoryProvider {
  static create(provider: ProviderType): GeoProvider {
    switch (provider) {
      case 'google':
        return new GoogleProvider(process.env.GOOGLE_API_KEY!);
      case 'nominatim':
        return new NominatimProvider();
      case 'mapbox':
        return new MapboxProvider(process.env.MAPBOX_TOKEN!);
      default:
        throw new Error('Proveedor de geocodificación no soportado');
    }
  }
}
