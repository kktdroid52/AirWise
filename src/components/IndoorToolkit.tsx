import { useState } from 'react';
import { indoorChecklist, type IndoorInput } from '../utils/indoor';

export function IndoorToolkit() {
  const [v, setV] = useState<IndoorInput>({ room: 'bedroom', size: 'medium', ventilation: 'ok', purifier: false });
  const sel = <K extends 'room' | 'size' | 'ventilation'>(k: K, label: string, opts: string[]) => (
    <label className="block">{label}
      <select className="field mt-1" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value } as IndoorInput)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>);
  return (
    <section aria-labelledby="in-h">
      <h2 id="in-h" className="text-2xl">Indoor air checklist</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {sel('room', 'Room', ['bedroom', 'living room', 'kitchen'])}
        {sel('size', 'Room size', ['small', 'medium', 'large'])}
        {sel('ventilation', 'Ventilation', ['ok', 'poor'])}
      </div>
      <label className="mt-3 inline-flex items-center gap-2 min-h-[44px]"><input type="checkbox" checked={v.purifier} onChange={(e) => setV({ ...v, purifier: e.target.checked })} /> I have an air purifier</label>
      <ul className="mt-2 list-disc pl-5 space-y-1">{indoorChecklist(v).map((i) => <li key={i}>{i}</li>)}</ul>
    </section>
  );
}
