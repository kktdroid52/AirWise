import { describe, it, expect } from 'vitest';
import { parsePlaces } from '../services/geocodingService';
describe('parsePlaces', () => {
  it('builds labelled places', () => {
    const [p] = parsePlaces({ results: [{ name: 'Kolkata', admin1: 'West Bengal', country: 'India', latitude: 22.57, longitude: 88.36 }] });
    expect(p.label).toBe('Kolkata, West Bengal, India');
  });
  it('returns [] for missing or malformed data', () => {
    expect(parsePlaces({})).toEqual([]);
    expect(parsePlaces(null)).toEqual([]);
    expect(parsePlaces({ results: [{ name: 'X' }] })).toEqual([]);
  });
});
