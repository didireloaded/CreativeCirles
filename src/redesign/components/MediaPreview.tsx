import { useEffect, useState } from 'react';
import { FileAudio, RefreshCw, Trash2 } from 'lucide-react';

type Valid = { ok: true; kind: 'image' | 'video' | 'audio' };
type Invalid = { ok: false; message: string };
const limits = { image: 15, audio: 30, video: 100 } as const;

// eslint-disable-next-line react-refresh/only-export-components
export function validateMediaFile(file: File): Valid | Invalid {
  const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : null;
  if (!kind) return { ok: false, message: 'Choose an image, video, or audio file.' };
  if (file.size > limits[kind] * 1024 * 1024) return { ok: false, message: `${kind === 'image' ? 'Images' : kind === 'audio' ? 'Audio files' : 'Videos'} must be ${limits[kind]} MB or smaller.` };
  return { ok: true, kind };
}

function sizeLabel(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

export default function MediaPreview({ file, onRemove, onReplace }: { file: File | null; onRemove: () => void; onReplace: () => void }) {
  const validation = file ? validateMediaFile(file) : null;
  const [url,setUrl] = useState('');
  useEffect(() => {
    if (!file || !validation?.ok || typeof URL.createObjectURL !== 'function') { setUrl(''); return; }
    const next = URL.createObjectURL(file); setUrl(next);
    return () => { if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(next); };
  }, [file, validation?.ok]);
  if (!file || !validation?.ok) return null;
  return <section className="media-preview" aria-label={`${validation.kind} preview`}>
    <div className="media-preview-stage">{validation.kind === 'image' ? <img src={url} alt={`Preview of ${file.name}`} /> : validation.kind === 'video' ? <video src={url} controls playsInline /> : <div className="media-audio"><FileAudio/><audio src={url} controls /></div>}</div>
    <div className="media-preview-info"><div><strong>{file.name}</strong><span>{validation.kind} · {sizeLabel(file.size)} · local preview</span></div><button type="button" onClick={onReplace}><RefreshCw/>Replace</button><button type="button" onClick={onRemove}><Trash2/>Remove</button></div>
  </section>;
}
