import type { AirReading, Place } from '../types';
import { demoReading } from '../data/demoData';
import { isValidAqi } from '../utils/aqi';
import { searchCities } from './geocodingService';

const cache = new Map<string, { at: number; reading: AirReading }>();
const TTL_MS = 10 * 60 * 1000;

export async function fetchAirQualityForPlace(place: Place): Promise<AirReading> {
  const key = `${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.reading;
  try {
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.latitude}&longitude=${place.longitude}&current=us_aqi,pm2_5,pm10`);
    const c = (await res.json())?.current;
    if (!res.ok || !c || !isValidAqi(c.us_aqi)) throw new Error('No AQI data');
    const reading: AirReading = {
      location: place.label, aqi: Math.round(c.us_aqi), pm25: c.pm2_5 ?? null, pm10: c.pm10 ?? null,
      source: 'Open-Meteo (modelled estimate)',
      updatedAt: c.time ? new Date(c.time + 'Z').toISOString() : new Date().toISOString(), isDemo: false,
    };
    cache.set(key, { at: Date.now(), reading });
    return reading;
  } catch {
    return demoReading(place.label);
  }
}

export async function fetchAirQuality(location: string): Promise<AirReading> {
  try {
    const [place] = await searchCities(location, undefined, 1);
    return place ? await fetchAirQualityForPlace(place) : demoReading(location);
  } catch {
    return demoReading(location);
  }
}
