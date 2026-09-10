export function readLocal<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(`circle:${key}`) || 'null') ?? fallback; }
  catch { return fallback; }
}
export function writeLocal(key: string, value: unknown): boolean {
  try { localStorage.setItem(`circle:${key}`, JSON.stringify(value)); return true; }
  catch { return false; }
}
