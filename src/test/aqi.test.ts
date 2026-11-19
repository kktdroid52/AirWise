import { describe, it, expect } from 'vitest';
import { categorizeAqi, isValidAqi } from '../utils/aqi';
describe('categorizeAqi', () => {
  it('maps band edges', () => {
    expect(categorizeAqi(50).level).toBe('good');
    expect(categorizeAqi(51).level).toBe('moderate');
    expect(categorizeAqi(182).level).toBe('unhealthy');
    expect(categorizeAqi(450).level).toBe('hazardous');
  });
  it('handles bad input', () => { expect(categorizeAqi(NaN).level).toBe('good'); expect(categorizeAqi(-5).level).toBe('good'); });
  it('validates readings', () => { expect(isValidAqi(120)).toBe(true); expect(isValidAqi(null)).toBe(false); expect(isValidAqi(5000)).toBe(false); });
});
