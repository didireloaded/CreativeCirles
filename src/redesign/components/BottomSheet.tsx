import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode; className?: string };

export default function BottomSheet({ open, title, onClose, children, className = '' }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open) {
      opener.current = document.activeElement as HTMLElement;
      if (!node.open) {
        if (typeof node.showModal === 'function') node.showModal();
        else node.setAttribute('open', '');
      }
      document.body.classList.add('ui-layer-open');
    } else if (node.open) {
      if (typeof node.close === 'function') node.close();
      else node.removeAttribute('open');
      document.body.classList.remove('ui-layer-open');
      opener.current?.focus();
    }
    return () => document.body.classList.remove('ui-layer-open');
  }, [open]);

  return <dialog ref={dialog} className={`ui-sheet ${className}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="ui-sheet-panel">
      <header><h2 id={titleId}>{title}</h2><button className="icon-button" onClick={onClose} aria-label={`Close ${title}`}><X /></button></header>
      <div className="ui-sheet-content">{children}</div>
    </div>
  </dialog>;
}
