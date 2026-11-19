import type { Activity } from '../types';

export const DEFAULT_TIMES: Record<Activity, string> = {
  'College commute': '08:00', 'Office commute': '09:00', Walking: '07:00', Exercise: '06:30',
  Shopping: '17:00', 'Outdoor errands': '11:00', 'Family outing': '16:00',
};

export function sortByTime<T extends { time: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.time.localeCompare(b.time));
}

export function clampAqi(value: number): number {
  return Number.isFinite(value) ? Math.min(500, Math.max(0, Math.round(value))) : 0;
}
