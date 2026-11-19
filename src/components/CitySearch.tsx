import { useEffect, useId, useState } from 'react';
import type { Place } from '../types';
import { searchCities } from '../services/geocodingService';
import { validateLocation } from '../utils/validation';

interface Props { initial: string; onSelectPlace: (p: Place) => void; onSearchText: (t: string) => void; onLocate: () => void; }

export function CitySearch({ initial, onSelectPlace, onSearchText, onLocate }: Props) {
  const [query, setQuery] = useState(initial);
  const [options, setOptions] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const listId = useId();

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) { setOptions([]); return; }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('Searching…');
      try {
        const found = await searchCities(q, ctrl.signal);
        setOptions(found); setActive(-1);
        setStatus(found.length ? `${found.length} suggestions available` : 'No matching places');
      } catch (e) {
        if ((e as Error).name !== 'AbortError') { setOptions([]); setStatus('Suggestions unavailable. Press Enter to search.'); }
      }
    }, 250);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [query, open]);

  const choose = (p: Place) => { setQuery(p.label); setOpen(false); setError(''); onSelectPlace(p); };
  const submit = () => {
    if (active >= 0 && options[active]) return choose(options[active]);
    const v = validateLocation(query);
    setError(v.error ?? '');
    if (v.ok) { setOpen(false); onSearchText(v.value); }
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Escape') setOpen(false);
  };
  const showList = open && options.length > 0;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <label htmlFor="loc" className="sr-only">City or area</label>
          <input id="loc" className="field" role="combobox" aria-expanded={showList} aria-controls={listId} aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined} aria-invalid={!!error} aria-describedby={error ? 'loc-err' : undefined}
            autoComplete="off" placeholder="Search a city, e.g. Kolkata" value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onKeyDown={onKey}
            onBlur={() => setOpen(false)} onFocus={() => query.trim().length >= 2 && setOpen(true)} />
          {showList && (
            <ul id={listId} role="listbox" className="absolute z-10 mt-1 w-full bg-white border border-slate2/40 rounded shadow-lg max-h-64 overflow-auto">
              {options.map((p, i) => (
                <li key={`${p.latitude},${p.longitude}`} id={`${listId}-${i}`} role="option" aria-selected={i === active}
                  className={`min-h-[44px] px-3 flex items-center cursor-pointer ${i === active ? 'bg-teal text-white' : 'hover:bg-paper'}`}
                  onMouseDown={(e) => { e.preventDefault(); choose(p); }} onMouseEnter={() => setActive(i)}>{p.label}</li>))}
            </ul>)}
        </div>
        <button type="button" className="btn" onClick={submit}>Check air</button>
        <button type="button" className="btn-quiet" onClick={onLocate}>Use my location</button>
      </div>
      <p className="sr-only" role="status">{status}</p>
      {error && <p id="loc-err" role="alert" className="mt-1 text-coral">{error}</p>}
    </div>
  );
}
