import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import type { Creator } from '../types';

export type Story = { id: string; creator: Creator; image: string; label: string };

export default function StoryViewer({ open, stories, initialIndex, onClose }: { open: boolean; stories: Story[]; initialIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null); const opener = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(initialIndex); const [paused, setPaused] = useState(false);
  useEffect(() => { if (open) setIndex(initialIndex); }, [initialIndex, open]);
  useEffect(() => { const node=dialog.current;if(!node)return;if(open&&!node.open){opener.current=document.activeElement as HTMLElement;if(typeof node.showModal==='function')node.showModal();else node.setAttribute('open','')}else if(!open&&node.open){if(typeof node.close==='function')node.close();else node.removeAttribute('open');opener.current?.focus()} }, [open]);
  useEffect(() => { if (!open || paused || (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return; const timer=window.setTimeout(() => { if(index>=stories.length-1)onClose();else setIndex(value=>value+1); },6000);return()=>clearTimeout(timer); },[index,onClose,open,paused,stories.length]);
  if (!stories.length) return null;
  const story=stories[Math.min(index,stories.length-1)];
  const previous=()=>setIndex(value=>Math.max(0,value-1)); const next=()=>index>=stories.length-1?onClose():setIndex(value=>value+1);
  return <dialog ref={dialog} className="story-dialog" aria-label={`Story by ${story.creator.name}`} onCancel={event=>{event.preventDefault();onClose()}} onKeyDown={event=>{if(event.key==='Escape')onClose()}} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onPointerDown={()=>setPaused(true)} onFocusCapture={()=>setPaused(true)}>
    <div className="story-progress" aria-hidden="true">{stories.map((item,itemIndex)=><i key={item.id} className={itemIndex<=index?'active':''}/>)}</div>
    <ImageWithFallback src={story.image} alt={story.label} ratio="9 / 16" />
    <header><ImageWithFallback src={story.creator.image} alt="" ratio="1"/><div><strong>{story.creator.name}</strong><span>{story.creator.role}</span></div><button aria-label="Close stories" onClick={onClose}><X/></button></header>
    <p>{story.label}</p>
    <button className="story-previous" aria-label="Previous story" onClick={previous} disabled={index===0}><ChevronLeft/></button><button className="story-next" aria-label="Next story" onClick={next}><ChevronRight/></button>
  </dialog>;
}
