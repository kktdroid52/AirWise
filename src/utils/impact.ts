import type { EcoAction } from '../types';

/** Rough, illustrative kg CO2e avoided per action vs. a solo ~5 km car trip. Assumptions, not measurements. */
export const IMPACT_ASSUMPTIONS_KG: Record<EcoAction, number> = {
  'Public transport': 0.5, Carpool: 0.4, 'Walked a short trip': 0.8,
  Cycled: 0.8, 'Combined errands': 0.4, 'Skipped a vehicle trip': 0.8,
};

export function weeklyEstimate(counts: Partial<Record<EcoAction, number>>): { actions: number; kgRange: [number, number] } {
  let actions = 0, kg = 0;
  for (const [action, n] of Object.entries(counts) as [EcoAction, number][]) {
    const count = Math.max(0, Math.floor(n || 0));
    actions += count;
    kg += count * (IMPACT_ASSUMPTIONS_KG[action] ?? 0);
  }
  return { actions, kgRange: [Math.round(kg * 0.5), Math.round(kg * 1.5)] };
}
