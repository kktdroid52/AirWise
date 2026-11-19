import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { AirReading, Place } from './types';
import { fetchAirQuality, fetchAirQualityForPlace } from './services/airQualityService';
import { AQICard } from './components/AQICard';
import { CitySearch } from './components/CitySearch';
import { Planner } from './components/Planner';
import { ChatAssistant } from './components/ChatAssistant';

const IndoorToolkit = lazy(() => import('./components/IndoorToolkit').then((m) => ({ default: m.IndoorToolkit })));
const EcoTracker = lazy(() => import('./components/EcoTracker').then((m) => ({ default: m.EcoTracker })));
const Learn = lazy(() => import('./components/Learn').then((m) => ({ default: m.Learn })));

const TABS = ['Today', 'Ask', 'Indoor', 'Sustainable', 'Learn'] as const;
type Tab = (typeof TABS)[number];

export default function App() {
  const [tab, setTab] = useState<Tab>('Today');
  const [reading, setReading] = useState<AirReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const run = useCallback(async (task: () => Promise<AirReading>) => {
    setLoading(true); setNotice('');
    setReading(await task());
    setLoading(false);
  }, []);
  useEffect(() => { void run(() => fetchAirQuality('Delhi')); }, [run]);

  const locate = () => {
    if (!navigator.geolocation) { setNotice('Your browser does not support location.'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { const p: Place = { name: 'Your location', label: 'Your location', latitude: pos.coords.latitude, longitude: pos.coords.longitude }; void run(() => fetchAirQualityForPlace(p)); },
      () => setNotice('Location permission was not granted. You can still search for a city.'),
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header>
        <h1 className="text-3xl font-bold">AirWise</h1>
        <p className="text-slate2">Breathe smarter. Make better everyday choices.</p>
        <div className="mt-4"><CitySearch initial="Delhi" onSelectPlace={(p) => void run(() => fetchAirQualityForPlace(p))} onSearchText={(t) => void run(() => fetchAirQuality(t))} onLocate={locate} /></div>
        {notice && <p role="status" className="mt-2 text-amber2">{notice}</p>}
      </header>
      <nav aria-label="Sections" className="mt-6 flex flex-wrap gap-1 border-b border-slate2/30">
        {TABS.map((t) => <button key={t} onClick={() => setTab(t)} aria-current={tab === t ? 'page' : undefined} className={`min-h-[44px] px-3 border-b-4 transition-colors ${tab === t ? 'border-teal font-semibold' : 'border-transparent hover:border-slate2/30'}`}>{t}</button>)}
      </nav>
      <main className="mt-6" aria-busy={loading}>
        {loading || !reading ? <p role="status">Loading air quality…</p> : (
          <Suspense fallback={<p role="status">Loading…</p>}>
            {tab === 'Today' && <div className="space-y-10"><AQICard reading={reading} /><Planner reading={reading} /></div>}
            {tab === 'Ask' && <ChatAssistant reading={reading} />}
            {tab === 'Indoor' && <IndoorToolkit />}
            {tab === 'Sustainable' && <EcoTracker />}
            {tab === 'Learn' && <Learn />}
          </Suspense>)}
      </main>
      <footer className="mt-12 text-sm text-slate2">General guidance only, not medical advice.</footer>
    </div>
  );
}
