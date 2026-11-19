import { describe, it, expect } from 'vitest';
import { weeklyEstimate } from '../utils/impact';
describe('weeklyEstimate', () => {
  it('is zero when empty', () => { expect(weeklyEstimate({})).toEqual({ actions: 0, kgRange: [0, 0] }); });
  it('returns a range, not a single exact figure', () => { const r = weeklyEstimate({ Cycled: 5 }); expect(r.kgRange[0]).toBeLessThan(r.kgRange[1]); expect(r.actions).toBe(5); });
  it('ignores negative counts', () => { expect(weeklyEstimate({ Carpool: -3 }).actions).toBe(0); });
});
