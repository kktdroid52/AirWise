import { describe, it, expect } from 'vitest';
import { categorizeAqi } from '../utils/aqi';
import { adviceFor, buildPlan } from '../utils/recommendations';
import { ruleBasedReply } from '../services/assistantService';
import { demoReading } from '../data/demoData';
import { validateLocation } from '../utils/validation';
describe('recommendations', () => {
  it('moves exercise indoors when unhealthy', () => { expect(adviceFor('Exercise', categorizeAqi(182)).advice).toMatch(/indoors/i); });
  it('allows exercise in good air', () => { expect(adviceFor('Exercise', categorizeAqi(30)).advice).toMatch(/ahead/i); });
  it('suggests transit for commutes in poor air', () => { expect(adviceFor('College commute', categorizeAqi(182)).advice).toMatch(/metro|bus/i); });
  it('returns empty plan for no activities', () => { expect(buildPlan([], categorizeAqi(100))).toEqual([]); });
});
describe('fallbacks and validation', () => {
  it('demo data is labelled demo', () => { expect(demoReading('X').isDemo).toBe(true); });
  it('rule-based reply works without an API', () => { expect(ruleBasedReply('Is exercise ok?', demoReading('X'))).toMatch(/AQI is 182/); });
  it('rejects short or tag-only locations', () => { expect(validateLocation('a').ok).toBe(false); expect(validateLocation('<>').ok).toBe(false); expect(validateLocation(' Pune ').value).toBe('Pune'); });
});
