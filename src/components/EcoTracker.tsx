import { useState } from 'react';
import type { EcoAction } from '../types';
import { weeklyEstimate } from '../utils/impact';

const ACTIONS: EcoAction[] = ['Public transport', 'Carpool', 'Walked a short trip', 'Cycled', 'Combined errands', 'Skipped a vehicle trip'];
const WEEKLY_GOAL = 7;

export function EcoTracker() {
  const [log, setLog] = useState<EcoAction[]>([]);
  const counts = log.reduce<Partial<Record<EcoAction, number>>>((acc, a) => ({ ...acc, [a]: (acc[a] ?? 0) + 1 }), {});
  const { actions, kgRange } = weeklyEstimate(counts);
  return (
    <section aria-labelledby="eco-h">
      <h2 id="eco-h" className="text-2xl">Lower-emission choices this week</h2>
      <div className="mt-3 flex flex-wrap gap-2">{ACTIONS.map((a) => (
        <button key={a} className="btn-quiet transition-colors hover:border-forest hover:bg-forest/5" onClick={() => setLog((l) => [...l, a])}>{a}{counts[a] ? ` (${counts[a]})` : ''}</button>))}</div>
      <div className="mt-4">
        <label htmlFor="goal" className="block text-sm">Weekly goal: {Math.min(actions, WEEKLY_GOAL)} of {WEEKLY_GOAL} actions</label>
        <progress id="goal" className="w-full h-3 accent-teal" value={Math.min(actions, WEEKLY_GOAL)} max={WEEKLY_GOAL} />
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn-quiet" disabled={!log.length} onClick={() => setLog((l) => l.slice(0, -1))}>Undo last</button>
        <button className="btn-quiet" disabled={!log.length} onClick={() => setLog([])}>Reset week</button>
      </div>
      <p className="mt-4" role="status">{actions === 0 ? 'No actions logged yet. Tap an action each time you do it.' : `${actions} actions logged. Rough estimate: ${kgRange[0]} to ${kgRange[1]} kg CO₂e avoided.`}</p>
      <p className="mt-2 text-sm text-slate2">Assumption: each action replaces a solo ~5 km petrol-car trip. This is an illustration, not a measurement. Your own exposure and the emissions you avoid are different outcomes: staying indoors protects you today, while cutting vehicle trips helps reduce the pollution everyone breathes.</p>
    </section>
  );
}
