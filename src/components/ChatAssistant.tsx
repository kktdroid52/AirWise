import { useState } from 'react';
import type { AirReading, ChatReply } from '../types';
import { askAssistant } from '../services/assistantService';

const QUICK = ['What precautions should I take for college today?', 'How can I improve my bedroom air?', 'Is outdoor exercise advisable today?', 'What can my family do today?'];

export function ChatAssistant({ reading }: { reading: AirReading }) {
  const [input, setInput] = useState('');
  const [log, setLog] = useState<Array<{ q: string; a: ChatReply }>>([]);
  const [busy, setBusy] = useState(false);
  const send = async (q: string) => {
    if (!q.trim() || busy) return;
    setBusy(true);
    const a = await askAssistant(q, reading);
    setLog((l) => [...l, { q: q.trim(), a }]);
    setInput(''); setBusy(false);
  };
  return (
    <section aria-labelledby="chat-h">
      <h2 id="chat-h" className="text-2xl">Ask AirWise</h2>
      <div className="mt-2 flex flex-wrap gap-2">{QUICK.map((q) => <button key={q} className="btn-quiet text-sm" onClick={() => send(q)}>{q}</button>)}</div>
      <div className="mt-4 space-y-4" aria-live="polite">{log.length === 0 && <p>Pick a question above or type your own.</p>}
        {log.map((m, i) => (<div key={i}><p className="font-semibold">You: {m.q}</p>
          <p>{m.a.text}</p><p className="text-sm text-slate2">{m.a.mode === 'ai' ? 'AI-generated answer.' : 'Assistant demo mode: rule-based answer, no AI model used.'}</p></div>))}</div>
      <div className="mt-4 flex gap-2"><label className="sr-only" htmlFor="q">Your question</label>
        <input id="q" className="field" maxLength={300} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)} placeholder="e.g. Suggest a low-pollution commute" />
        <button className="btn" onClick={() => send(input)} disabled={busy}>{busy ? 'Thinking' : 'Ask'}</button></div>
    </section>
  );
}
