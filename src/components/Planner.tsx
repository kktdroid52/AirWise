import { useMemo, useState } from 'react';
import type { Activity, AirReading } from '../types';
import { categorizeAqi } from '../utils/aqi';
import { buildPlan, FAMILY_CHECKLIST } from '../utils/recommendations';
import { clampAqi, DEFAULT_TIMES, sortByTime } from '../utils/schedule';

const ACTIVITIES: Activity[] = ['College commute', 'Office commute', 'Walking', 'Exercise', 'Shopping', 'Outdoor errands', 'Family outing'];

export function Planner({ reading }: { reading: AirReading }) {
  const [selected, setSelected] = useState<Activity[]>(['College commute']);
  const [times, setTimes] = useState(DEFAULT_TIMES);
  const [done, setDone] = useState<Activity[]>([]);
  const [preview, setPreview] = useState<number | null>(null);
  const [family, setFamily] = useState(false);

  const aqi = preview ?? reading.aqi;
  const cat = categorizeAqi(aqi);
  const plan = useMemo(
    () => sortByTime(buildPlan(selected, categorizeAqi(aqi)).map((p) => ({ ...p, time: times[p.activity] }))),
    [selected, aqi, times],
  );
  const toggle = (a: Activity) => setSelected((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));
  const toggleDone = (a: Activity) => setDone((d) => (d.includes(a) ? d.filter((x) => x !== a) : [...d, a]));

  return (
    <section aria-labelledby="plan-h">
      <h2 id="plan-h" className="text-2xl">Your day, adjusted for the air</h2>
      <fieldset className="mt-3"><legend className="mb-2">Pick what you plan to do today</legend>
        <div className="flex flex-wrap gap-2">{ACTIVITIES.map((a) => (
          <label key={a} className={`min-h-[44px] px-3 inline-flex items-center gap-2 rounded border cursor-pointer transition-colors ${selected.includes(a) ? 'border-forest bg-forest text-paper' : 'border-slate2/40 hover:border-forest'}`}>
            <input type="checkbox" checked={selected.includes(a)} onChange={() => toggle(a)} />{a}
          </label>))}</div>
      </fieldset>

      <div className="mt-5 border border-slate2/30 rounded p-3">
        <label htmlFor="preview" className="block font-semibold">What if the AQI were different?</label>
        <input id="preview" type="range" min={0} max={400} step={10} value={aqi} className="w-full mt-2 min-h-[44px]"
          aria-valuetext={`AQI ${aqi}, ${cat.label}`} onChange={(e) => setPreview(clampAqi(Number(e.target.value)))} />
        <p className="text-sm" aria-live="polite">
          {preview === null ? `Using today’s AQI: ${aqi} (${cat.label}). Drag to preview how your plan would change.`
            : `Preview only, not real data: AQI ${aqi} (${cat.label}).`}
          {preview !== null && <button className="btn-quiet ml-2 text-sm" onClick={() => setPreview(null)}>Back to today’s AQI</button>}
        </p>
      </div>

      {plan.length === 0 && <p className="mt-4">Select at least one activity to see your plan.</p>}
      <ol className="mt-4 space-y-3">{plan.map((p) => (
        <li key={p.activity} className="border-l-4 border-teal pl-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={done.includes(p.activity)} onChange={() => toggleDone(p.activity)} aria-label={`Mark ${p.activity} done`} />
              <strong className={done.includes(p.activity) ? 'line-through text-slate2' : ''}>{p.activity}</strong></label>
            <label className="text-sm text-slate2">Time <input type="time" className="field !w-auto ml-1" value={p.time} onChange={(e) => setTimes({ ...times, [p.activity]: e.target.value })} /></label>
          </div>
          <p>{p.advice}</p><p className="text-sm text-slate2">Why: {p.reason}</p>
        </li>))}</ol>

      <label className="mt-6 inline-flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={family} onChange={(e) => setFamily(e.target.checked)} /> Show family checklist for high-pollution days</label>
      {family && <ul className="mt-2 list-disc pl-5 space-y-1">{FAMILY_CHECKLIST.map((i) => <li key={i}>{i}</li>)}</ul>}
    </section>
  );
}
