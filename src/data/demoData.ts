import type { AirReading } from '../types';
export const demoReading = (location: string): AirReading => ({
  location: location || 'Sample city', aqi: 182, pm25: 108, pm10: 190,
  source: 'Simulated sample data', updatedAt: new Date().toISOString(), isDemo: true,
});
