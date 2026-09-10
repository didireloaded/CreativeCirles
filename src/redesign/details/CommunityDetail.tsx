import { Check, Users } from 'lucide-react';
import { useState } from 'react';
import BottomSheet from '../components/BottomSheet';
import ImageWithFallback from '../components/ImageWithFallback';
import type { Community } from '../types';

function readJoined(): string[] { try { const value = JSON.parse(localStorage.getItem('circle:joined-communities') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }

export default function CommunityDetail({ open, community, onClose, notify }: { open: boolean; community: Community | null; onClose: () => void; notify: (message: string) => void }) {
  const [joined, setJoined] = useState<string[]>(readJoined);
  if (!community) return null;
  const active = joined.includes(community.id);
  const toggle = () => { const next = active ? joined.filter(id => id !== community.id) : [...joined, community.id]; setJoined(next); try { localStorage.setItem('circle:joined-communities', JSON.stringify(next)); } catch { /* Session state remains available. */ } notify(active ? `Left ${community.name} in this preview.` : `Joined ${community.name} in this preview.`); };
  return <BottomSheet open={open} title={community.name} onClose={onClose} className="detail-sheet community-detail">
    <ImageWithFallback src={community.image} alt={`${community.name} cover`} ratio="16 / 8" />
    <div className="community-heading"><div><p className="eyebrow">{community.category}</p><h3>{community.name}</h3><span><Users />{community.members + (active ? 1 : 0)} preview members</span></div><button className={`button ${active ? 'secondary' : 'primary'}`} aria-label={active ? 'Leave community' : 'Join community'} onClick={toggle}>{active ? <><Check />Joined</> : 'Join community'}</button></div>
    <p className="detail-caption">{community.description}</p><blockquote>{community.purpose}</blockquote>
    <section><p className="eyebrow">DISCIPLINES</p><div className="detail-chips">{community.disciplines.map(item => <span key={item}>{item}</span>)}</div></section>
    <section><p className="eyebrow">PEOPLE IN THIS CIRCLE</p><div className="community-members">{community.memberPreviews.map(member => <div key={member.id}><ImageWithFallback src={member.image} alt="" ratio="1"/><span>{member.name}</span></div>)}</div></section>
    <section><p className="eyebrow">RECENT WORK</p><div className="community-work">{community.recentWork.map((image, index) => <ImageWithFallback key={image} src={image} alt={`${community.name} recent work ${index + 1}`} ratio="4 / 3" />)}</div></section>
  </BottomSheet>;
}
