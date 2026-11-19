import { describe, it, expect } from 'vitest';
import { clampAqi, sortByTime, DEFAULT_TIMES } from '../utils/schedule';
describe('schedule helpers', () => {
  it('sorts items by time', () => { expect(sortByTime([{ time: '17:00' }, { time: '06:30' }]).map((i) => i.time)).toEqual(['06:30', '17:00']); });
  it('does not mutate its input', () => { const a = [{ time: '09:00' }, { time: '08:00' }]; sortByTime(a); expect(a[0].time).toBe('09:00'); });
  it('clamps AQI to 0–500 and handles NaN', () => { expect(clampAqi(-20)).toBe(0); expect(clampAqi(900)).toBe(500); expect(clampAqi(NaN)).toBe(0); expect(clampAqi(120.6)).toBe(121); });
  it('has a default time for every activity', () => { expect(Object.values(DEFAULT_TIMES).every((t) => /^\d\d:\d\d$/.test(t))).toBe(true); });
});
