export type AqiLevel = 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';
export interface AqiCategory { level: AqiLevel; label: string; severity: number; meaning: string; color: string; }
export interface AirReading {
  location: string; aqi: number; pm25: number | null; pm10: number | null;
  source: string; updatedAt: string; isDemo: boolean;
}
export type Activity = 'College commute' | 'Office commute' | 'Walking' | 'Exercise' | 'Shopping' | 'Outdoor errands' | 'Family outing';
export type EcoAction = 'Public transport' | 'Carpool' | 'Walked a short trip' | 'Cycled' | 'Combined errands' | 'Skipped a vehicle trip';
export interface ChatReply { text: string; mode: 'assistant-demo' | 'ai'; }
export interface Place { name: string; label: string; latitude: number; longitude: number; }
