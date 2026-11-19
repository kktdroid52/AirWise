import type { AqiCategory } from '../types';

const BANDS: Array<[number, Omit<AqiCategory, 'severity'>]> = [
  [50, { level: 'good', label: 'Good', color: '#2F7D4F', meaning: 'Air is clean enough for normal routines.' }],
  [100, { level: 'moderate', label: 'Moderate', color: '#8A5A0F', meaning: 'Acceptable for most people; unusually sensitive people may notice effects.' }],
  [150, { level: 'sensitive', label: 'Unhealthy for sensitive groups', color: '#A8531A', meaning: 'Children, older adults and people with breathing or heart conditions should cut back on long outdoor effort.' }],
  [200, { level: 'unhealthy', label: 'Unhealthy', color: '#B03A28', meaning: 'Everyone should reduce prolonged outdoor exertion.' }],
  [300, { level: 'veryUnhealthy', label: 'Very unhealthy', color: '#8E2A5B', meaning: 'Avoid outdoor exertion; keep essential trips short.' }],
  [Infinity, { level: 'hazardous', label: 'Hazardous', color: '#5B1A2E', meaning: 'Stay indoors where possible and limit exposure.' }],
];

export function categorizeAqi(aqi: number): AqiCategory {
  const value = Number.isFinite(aqi) ? Math.max(0, aqi) : 0;
  const index = BANDS.findIndex(([max]) => value <= max);
  return { ...BANDS[index][1], severity: index };
}

export function isValidAqi(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1000;
}
