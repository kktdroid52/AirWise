import type { AirReading } from '../types';
import { categorizeAqi } from '../utils/aqi';

export function AQICard({ reading }: { reading: AirReading }) {
  const cat = categorizeAqi(reading.aqi);
  const pct = Math.min(reading.aqi / 300, 1);
  const r = 70, c = 2 * Math.PI * r;
  return (
    <section aria-labelledby="aqi-h" className="grid gap-6 md:grid-cols-[220px_1fr] items-center">
      <div className="relative w-[200px] h-[200px] mx-auto" role="img" aria-label={`Air quality index ${reading.aqi}, ${cat.label}`}>
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle cx="90" cy="90" r={r} fill="none" stroke="#DAD6CB" strokeWidth="14" />
          <circle cx="90" cy="90" r={r} fill="none" stroke={cat.color} strokeWidth="14" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset .7s ease, stroke .3s" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">{reading.aqi}</span><span className="text-sm">AQI</span>
        </div>
      </div>
      <div>
        <h2 id="aqi-h" className="text-2xl">{reading.location}</h2>
        <p className="mt-1 text-lg font-semibold" style={{ color: cat.color }}>Level {cat.severity + 1} of 6: {cat.label}</p>
        <p className="mt-2 max-w-prose">{cat.meaning}</p>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div><dt className="inline text-slate2">PM2.5 </dt><dd className="inline font-semibold">{reading.pm25 != null ? `${Math.round(reading.pm25)} µg/m³` : 'not available'}</dd></div>
          <div><dt className="inline text-slate2">PM10 </dt><dd className="inline font-semibold">{reading.pm10 != null ? `${Math.round(reading.pm10)} µg/m³` : 'not available'}</dd></div>
        </dl>
        <p className="mt-2 text-sm text-slate2">Source: {reading.source}. Updated {new Date(reading.updatedAt).toLocaleString()}.</p>
        {reading.isDemo && <p className="mt-2 inline-block border border-amber2 text-amber2 px-2 text-sm font-semibold" role="status">DEMO: simulated readings, not live data</p>}
      </div>
    </section>
  );
}
