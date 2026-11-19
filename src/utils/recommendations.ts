import type { Activity, AqiCategory } from '../types';

export interface PlanItem { activity: Activity; advice: string; reason: string; }

const INTENSITY: Record<Activity, 'low' | 'medium' | 'high'> = {
  'College commute': 'medium', 'Office commute': 'medium', Walking: 'medium', Exercise: 'high',
  Shopping: 'low', 'Outdoor errands': 'medium', 'Family outing': 'medium',
};

export function adviceFor(activity: Activity, category: AqiCategory): PlanItem {
  const s = category.severity;
  const intensity = INTENSITY[activity];
  const threshold = intensity === 'high' ? 1 : 2;
  let advice: string;
  let reason: string;
  if (activity.endsWith('commute')) {
    advice = s >= 2 ? 'Prefer metro, bus or a shared ride; wear a well-fitted N95/FFP2 mask if you must be in traffic; avoid waiting beside busy roads.' : 'Normal commute is fine; choose quieter streets where practical.';
    reason = 'Roadside air is often worse than the city average, and time near traffic adds up.';
  } else if (s < threshold) {
    advice = 'Go ahead as planned. Re-check AQI before you leave.';
    reason = `${category.label} air with ${intensity} breathing effort is low concern for most people.`;
  } else if (intensity === 'high') {
    advice = 'Move this indoors today, or keep it light and short. Resume outdoors when AQI drops.';
    reason = 'Hard breathing pulls more polluted air deeper into the lungs.';
  } else {
    advice = 'Shorten it, go during the cleaner part of the day, and pick parks or side streets over main roads. Postpone if you can.';
    reason = 'Lower effort and shorter time outside both reduce what you breathe in.';
  }
  return { activity, advice, reason };
}

export function buildPlan(activities: Activity[], category: AqiCategory): PlanItem[] {
  return activities.map((a) => adviceFor(a, category));
}

export function ventilationAdvice(category: AqiCategory): string {
  return category.severity >= 2
    ? 'Keep windows mostly closed while outdoor AQI is high. Air the room briefly when the AQI dips.'
    : 'Ventilate normally, ideally away from rush hours.';
}

export const FAMILY_CHECKLIST = [
  'Check AQI before school runs and outdoor play.',
  'Move children’s active play indoors on unhealthy days.',
  'Keep older family members’ outdoor trips short.',
  'Skip burning waste, coal or incense indoors.',
  'Wet-mop or damp-dust instead of sweeping dry.',
  'Follow your doctor’s advice for any existing conditions.',
];
