export interface IndoorInput { room: 'bedroom' | 'living room' | 'kitchen'; size: 'small' | 'medium' | 'large'; ventilation: 'poor' | 'ok'; purifier: boolean; }

export function indoorChecklist(i: IndoorInput): string[] {
  const list = [
    'Avoid indoor smoke: no burning waste, coal, incense or smoking indoors.',
    'Damp-dust and wet-mop rather than dry sweeping.',
    'Check outdoor AQI before opening windows; air out briefly when it is lower.',
  ];
  if (i.room === 'kitchen') list.push('Use the exhaust fan or open a window slightly while cooking.');
  if (i.room === 'bedroom') list.push('Keep the bedroom door closed to protect the cleanest air for sleeping.');
  if (i.ventilation === 'poor') list.push('Seal obvious gaps around doors and windows with low-cost draught strips.');
  if (i.purifier) {
    list.push(i.size === 'large' ? 'A large room may need more than one purifier; run it where you spend most time.' : 'Run the purifier with doors closed and keep filters fresh.');
    list.push('Avoid ozone-producing "ionizer" cleaners.');
  } else {
    list.push('A purifier is optional. If you buy one, match its CADR to your room size and avoid ozone generators.');
  }
  return list;
}
