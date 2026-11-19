import type { AirReading, ChatReply } from '../types';
import { categorizeAqi } from '../utils/aqi';
import { sanitizeText } from '../utils/validation';
import { ventilationAdvice } from '../utils/recommendations';

export function ruleBasedReply(question: string, reading: AirReading): string {
  const q = question.toLowerCase();
  const cat = categorizeAqi(reading.aqi);
  const head = `AQI is ${reading.aqi} (${cat.label}) in ${reading.location}.`;
  if (/exercis|run|gym|jog/.test(q)) return `${head} ${cat.severity >= 1 ? 'Move hard workouts indoors today; keep any outdoor activity light and short.' : 'Outdoor exercise is reasonable; re-check before you start.'}`;
  if (/bedroom|indoor|home|room|purif/.test(q)) return `${head} ${ventilationAdvice(cat)} Damp-dust, avoid indoor smoke, and keep the bedroom door closed.`;
  if (/commut|college|office|travel|transport/.test(q)) return `${head} ${cat.severity >= 2 ? 'Prefer public transport or a shared ride, avoid congested roads, and consider an N95/FFP2 mask.' : 'Your normal commute is fine; quieter streets are a bonus.'}`;
  if (/family|child|kid|parent|elder/.test(q)) return `${head} ${cat.severity >= 2 ? 'Keep children’s play indoors, shorten older relatives’ outings, and keep windows mostly shut.' : 'Normal activities are fine; check again before evening outings.'}`;
  return `${head} ${cat.meaning} Ask about commuting, exercise, your home or your family for specific steps.`;
}

export async function askAssistant(question: string, reading: AirReading): Promise<ChatReply> {
  const clean = sanitizeText(question, 300);
  const endpoint = import.meta.env.VITE_ASSISTANT_ENDPOINT as string | undefined;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: clean, aqi: reading.aqi, pm25: reading.pm25, location: reading.location }) });
      const data = await res.json();
      if (res.ok && typeof data?.text === 'string') return { text: data.text, mode: 'ai' };
    } catch { /* fall back to rule-based mode */ }
  }
  return { text: ruleBasedReply(clean, reading), mode: 'assistant-demo' };
}
