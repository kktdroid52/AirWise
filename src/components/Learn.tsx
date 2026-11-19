const TOPICS: Array<[string, string]> = [
  ['AQI', 'A 0–500 scale that turns pollutant levels into one number. Higher means more concern.'],
  ['PM2.5 and PM10', 'Tiny particles (under 2.5 and 10 micrometres). PM2.5 is small enough to get deep into the lungs.'],
  ['Winter smog', 'Cold, still air traps smoke, dust and vehicle exhaust near the ground, so pollution builds up.'],
  ['Traffic and indoor pollution', 'Roadsides carry extra exhaust. Indoors, smoke, cooking and dust add to what leaks in from outside.'],
  ['Exposure vs. emissions', 'Reducing exposure protects you now. Reducing emissions lowers pollution for everyone over time.'],
];
export function Learn() {
  return (<section aria-labelledby="learn-h"><h2 id="learn-h" className="text-2xl">Air quality basics</h2>
    <div className="mt-3 divide-y divide-slate2/20">{TOPICS.map(([t, d]) => (<details key={t} className="py-2"><summary className="cursor-pointer min-h-[44px] flex items-center font-semibold">{t}</summary><p className="pb-2">{d}</p></details>))}</div></section>);
}
