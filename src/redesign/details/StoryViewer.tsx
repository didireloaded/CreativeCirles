import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Send, X } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import { readStoryEngagement, saveStoryReaction, saveStoryReply, toggleStoryLike } from '../stories/engagement';
import type { Creator } from '../types';
import './story-engagement.css';

export type Story = { id: string; creator: Creator; image: string; label: string };
const reactions = ['👏', '✨', '🔥', '😍', '❤️', '🤯', '😂', '🙌'] as const;
const reactionNames = ['applause', 'sparkles', 'fire', 'heart eyes', 'heart', 'mind blown', 'laugh', 'raised hands'] as const;

export default function StoryViewer({ open, stories, initialIndex, onClose }: { open: boolean; stories: Story[]; initialIndex: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pointerX = useRef<number | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(false);
  const [engagement, setEngagement] = useState(readStoryEngagement);
  const [selectedReaction, setSelectedReaction] = useState(2);
  const [reply, setReply] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => { if (open) setIndex(initialIndex); }, [initialIndex, open]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      opener.current = document.activeElement as HTMLElement;
      if (typeof node.showModal === 'function') node.showModal(); else node.setAttribute('open', '');
    } else if (!open && node.open) {
      if (typeof node.close === 'function') node.close(); else node.removeAttribute('open');
      opener.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (!open || paused || (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const timer = window.setTimeout(() => { if (index >= stories.length - 1) onClose(); else setIndex(value => value + 1); }, 6000);
    return () => clearTimeout(timer);
  }, [index, onClose, open, paused, stories.length]);

  if (!stories.length) return null;
  const story = stories[Math.min(index, stories.length - 1)];
  const liked = engagement.likedIds.includes(story.id);
  const previous = () => setIndex(value => Math.max(0, value - 1));
  const next = () => index >= stories.length - 1 ? onClose() : setIndex(value => value + 1);

  function react(reactionIndex: number) {
    const emoji = reactions[reactionIndex];
    setSelectedReaction(reactionIndex);
    setFeedback(`Reacted with ${emoji}`);
    setEngagement(saveStoryReaction(story.id, emoji));
  }

  function submitReply(event: React.FormEvent) {
    event.preventDefault();
    const body = reply.trim();
    if (!body) return;
    setEngagement(saveStoryReply(story.id, story.creator.id, body));
    setReply('');
    setFeedback('Private reply saved — it will appear in Inbox when messaging is connected.');
  }

  function dragReaction(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerX.current === null) return;
    const distance = event.clientX - pointerX.current;
    if (Math.abs(distance) < 28) return;
    setSelectedReaction(current => Math.max(0, Math.min(reactions.length - 1, current + (distance < 0 ? 1 : -1))));
    pointerX.current = event.clientX;
  }

  return <dialog ref={dialog} className="story-dialog" aria-label={`Story by ${story.creator.name}`} onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
    <div className="story-progress" aria-hidden="true">{stories.map((item, itemIndex) => <i key={item.id} className={itemIndex <= index ? 'active' : ''} />)}</div>
    <ImageWithFallback src={story.image} alt={story.label} ratio="9 / 16" />
    <header><ImageWithFallback src={story.creator.image} alt="" ratio="1" /><div><strong>{story.creator.name}</strong><span>{story.creator.role}</span></div><button aria-label="Close stories" onClick={onClose}><X /></button></header>
    <p className="story-caption">{story.label}</p>
    <button className="story-previous" aria-label="Previous story" onClick={previous} disabled={index === 0}><ChevronLeft /></button><button className="story-next" aria-label="Next story" onClick={next}><ChevronRight /></button>
    <div className="story-engagement" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}>
      <div className="story-reaction-arc" role="toolbar" aria-label="Story reactions" tabIndex={0}
        onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setSelectedReaction(current => Math.max(0, Math.min(reactions.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)))); } if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); react(selectedReaction); } }}
        onPointerDown={event => { pointerX.current = event.clientX; }} onPointerMove={dragReaction} onPointerUp={() => { pointerX.current = null; }} onPointerCancel={() => { pointerX.current = null; }}>
        {reactions.map((emoji, reactionIndex) => {
          const distance = Math.abs(reactionIndex - selectedReaction);
          const offset = Math.min(distance, 3);
          return <button type="button" key={emoji} aria-label={`React with ${reactionNames[reactionIndex]}`} aria-pressed={engagement.reactions[story.id] === emoji} className={reactionIndex === selectedReaction ? 'is-selected' : ''} style={{ '--arc-y': `${offset * 7}px`, '--arc-scale': Math.max(.72, 1 - distance * .08) } as React.CSSProperties} onClick={() => react(reactionIndex)}><span>{emoji}</span></button>;
        })}
      </div>
      <form className="story-reply" onSubmit={submitReply}><label><span>Reply privately to {story.creator.name}</span><input aria-label={`Reply privately to ${story.creator.name}`} value={reply} onChange={event => setReply(event.target.value)} placeholder={`Reply to ${story.creator.name.split(' ')[0]}…`} /></label><button type="button" className={liked ? 'is-liked' : ''} aria-label={liked ? 'Unlike story' : 'Like story'} aria-pressed={liked} onClick={() => setEngagement(toggleStoryLike(story.id))}><Heart fill={liked ? 'currentColor' : 'none'} /></button><button type="submit" aria-label="Send private reply" disabled={!reply.trim()}><Send /></button></form>
    </div>
    <span className="story-feedback" role="status" aria-live="polite">{feedback}</span>
  </dialog>;
}
