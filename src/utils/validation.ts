export function sanitizeText(input: string, maxLength = 200): string {
  return input.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}
export function validateLocation(input: string): { ok: boolean; value: string; error?: string } {
  const value = sanitizeText(input, 80);
  if (value.length < 2) return { ok: false, value, error: 'Enter at least 2 characters, e.g. a city name.' };
  return { ok: true, value };
}
