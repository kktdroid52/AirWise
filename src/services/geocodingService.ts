import type { Place } from '../types';

export function parsePlaces(data: unknown): Place[] {
  const results = (data as { results?: unknown })?.results;
  if (!Array.isArray(results)) return [];
  return (results as Array<Record<string, unknown>>).flatMap((r) => {
    const { name, latitude, longitude, admin1, country } = r;
    if (typeof name !== 'string' || typeof latitude !== 'number' || typeof longitude !== 'number') return [];
    const label = [name, admin1, country].filter((p): p is string => typeof p === 'string').join(', ');
    return [{ name, label, latitude, longitude }];
  });
}

export async function searchCities(query: string, signal?: AbortSignal, count = 5): Promise<Place[]> {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=${count}&name=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error('Geocoding failed');
  return parsePlaces(await res.json());
}
