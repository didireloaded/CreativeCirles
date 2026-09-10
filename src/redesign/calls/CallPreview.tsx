import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, RefreshCw, Volume2, VolumeX, X } from 'lucide-react';
import type { Creator } from '../types';
import './call-preview.css';

export type CallMode = 'voice' | 'video';

export default function CallPreview({ open, mode, creator, onClose }: { open: boolean; mode: CallMode; creator: Creator; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(mode === 'voice');
  const [speakerOff, setSpeakerOff] = useState(false);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      if (typeof node.showModal === 'function') node.showModal(); else node.setAttribute('open', '');
    } else if (!open && node.open) {
      if (typeof node.close === 'function') node.close(); else node.removeAttribute('open');
    }
  }, [open]);
  useEffect(() => { setCameraOff(mode === 'voice'); }, [mode]);
  return <dialog ref={dialog} className="call-preview" aria-label={`${mode === 'video' ? 'Video' : 'Voice'} call preview with ${creator.name}`} onCancel={event => { event.preventDefault(); onClose(); }}>
    <img className="call-preview-backdrop" src={creator.image} alt="" />
    <div className="call-preview-wash" />
    <header><span>{mode === 'video' ? 'Video call' : 'Voice call'}</span><button aria-label="Close call preview" onClick={onClose}><X /></button></header>
    <div className="call-preview-identity"><img src={creator.image} alt="" /><p className="eyebrow">COMING SOON</p><h2>{creator.name}</h2><span>{creator.role}</span><strong>Preview only — nobody is being called</strong></div>
    <section className="call-preview-panel" aria-label="Call preview controls"><span className="call-preview-badge">Coming soon</span><div>
      <button aria-label={muted ? 'Unmute microphone' : 'Mute microphone'} aria-pressed={muted} onClick={() => setMuted(value => !value)}>{muted ? <MicOff /> : <Mic />}</button>
      <button aria-label={cameraOff ? 'Turn camera on' : 'Turn camera off'} aria-pressed={cameraOff} onClick={() => setCameraOff(value => !value)}>{cameraOff ? <CameraOff /> : <Camera />}</button>
      <button aria-label={speakerOff ? 'Turn speaker on' : 'Turn speaker off'} aria-pressed={speakerOff} onClick={() => setSpeakerOff(value => !value)}>{speakerOff ? <VolumeX /> : <Volume2 />}</button>
      <button aria-label="Switch camera preview" onClick={() => undefined}><RefreshCw /></button>
      <button className="call-preview-end" aria-label="End call preview" onClick={onClose}><PhoneOff /></button>
    </div></section>
  </dialog>;
}
