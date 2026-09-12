export function readLocal<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(`circle:${key}`) || 'null') ?? fallback; }
  catch { return fallback; }
}
export function writeLocal(key: string, value: unknown): boolean {
  try { localStorage.setItem(`circle:${key}`, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function useLocalState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readLocal(key, fallback));
  const update: Dispatch<SetStateAction<T>> = next => setValue(previous => {
    const resolved = typeof next === 'function' ? (next as (value: T) => T)(previous) : next;
    if (!writeLocal(key, resolved)) window.dispatchEvent(new Event('circle:storage-error'));
    return resolved;
  });
  return [value, update];
}
import { useState, type Dispatch, type SetStateAction } from 'react';
