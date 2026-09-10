import { useMemo, useState } from 'react';
import { BellRing, CalendarDays, Check, ChevronRight, Clock3, Headphones, Search, Users, Video, X } from 'lucide-react';
import { creators } from '../data';
import type { ScreenProps } from '../types';
import './meetings.css';

export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled';
export interface MeetingPreview {
  id: string;
  title: string;
  collaborator: string;
  time: string;
  duration: string;
  type: 'voice' | 'video' | 'studio';
  status: MeetingStatus;
  detail: string;
}

const meetings: MeetingPreview[] = [
  { id: 'first-cut', title: 'First cut review', collaborator: 'Leo M.', time: 'Today · 16:30', duration: '45 min', type: 'video', status: 'upcoming', detail: 'Review pacing, sound notes, and the final sequence together.' },
  { id: 'campaign', title: 'Campaign planning', collaborator: 'Nia S.', time: 'Tomorrow · 10:00', duration: '1 hr', type: 'studio', status: 'upcoming', detail: 'Align the visual direction, production needs, and the next fitting.' },
  { id: 'motion', title: 'Motion handover', collaborator: 'Mila J.', time: 'Friday · 14:00', duration: '30 min', type: 'voice', status: 'completed', detail: 'A completed handover for the title treatment and delivery package.' },
  { id: 'mural', title: 'Location walk-through', collaborator: 'Kai T.', time: 'Monday · 09:30', duration: '45 min', type: 'studio', status: 'cancelled', detail: 'The location walk-through needs a new date before planning continues.' },
];

const typeIcon = { voice: Headphones, video: Video, studio: Users };

export default function MeetingsView({ notify, profile }: Pick<ScreenProps, 'notify' | 'profile'>) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<MeetingStatus>('upcoming');
  const [reminders, setReminders] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const filtered = useMemo(() => meetings.filter(meeting => meeting.status === status && `${meeting.title} ${meeting.collaborator}`.toLowerCase().includes(query.trim().toLowerCase())), [query, status]);
  const nextMeeting = meetings[0];

  function previewJoin(meeting: MeetingPreview) {
    const message = `Preview only — No meeting was entered. ${meeting.title} will connect when calling is available.`;
    setFeedback(message);
    notify(message);
  }

  function toggleReminder(id: string) {
    setReminders(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  return <section className="meetings-view" aria-label="Sample meeting schedule">
    <div className="meetings-intro">
      <div>
        <p className="eyebrow">MAKE ROOM FOR THE CONVERSATION</p>
        <h2>Upcoming meetings</h2>
        <p>{profile.displayName || 'Jordan'}, keep the next creative conversation close.</p>
      </div>
      <span className="sample-label">Sample meeting schedule</span>
    </div>

    <label className="meetings-search"><Search aria-hidden="true" /><input aria-label="Find a collaborator or meeting" placeholder="Find a collaborator or meeting" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear meeting search" onClick={() => setQuery('')}><X /></button>}</label>

    <section className="meeting-people" aria-label="Active sample collaborators">
      <div className="meeting-section-heading"><h3>Active collaborators</h3><span>Planning together</span></div>
      <div className="meeting-people-row">{creators.map((creator, index) => <button key={creator.id} type="button" onClick={() => setQuery(creator.name)} aria-label={`Show meetings with ${creator.name}`}><span><img src={creator.image} alt="" />{index < 3 && <i aria-hidden="true" />}</span><b>{creator.name.split(' ')[0]}</b><small>{creator.role}</small></button>)}</div>
    </section>

    <div className="meetings-grid">
      <section className="meeting-list-column">
        <div className="meeting-section-heading"><h3>Your schedule</h3><span>{filtered.length} {filtered.length === 1 ? 'meeting' : 'meetings'}</span></div>
        <div className="meeting-filters" aria-label="Meeting status filters">{(['upcoming', 'completed', 'cancelled'] as const).map(value => <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>{value}</button>)}</div>
        <div className="meeting-list">{filtered.map(meeting => {
          const Icon = typeIcon[meeting.type];
          const reminderSet = reminders.includes(meeting.id);
          return <article className={`meeting-card meeting-${meeting.status}`} key={meeting.id}>
            <span className="meeting-type-icon"><Icon aria-hidden="true" /></span>
            <div className="meeting-card-copy"><span>{meeting.collaborator}</span><h4>{meeting.title}</h4><p><Clock3 /> {meeting.time} <i /> {meeting.duration}</p></div>
            <div className="meeting-card-actions">
              {meeting.status === 'upcoming' && <button type="button" className="meeting-join" aria-label={`Join ${meeting.title}`} onClick={() => previewJoin(meeting)}>Join</button>}
              <button type="button" className={reminderSet ? 'is-set' : ''} aria-label={`${reminderSet ? 'Remove' : 'Set'} reminder for ${meeting.title}`} aria-pressed={reminderSet} onClick={() => toggleReminder(meeting.id)}>{reminderSet ? <Check /> : <BellRing />}</button>
              <button type="button" aria-label={`${expanded === meeting.id ? 'Hide' : 'Show'} details for ${meeting.title}`} aria-expanded={expanded === meeting.id} onClick={() => setExpanded(expanded === meeting.id ? null : meeting.id)}><ChevronRight /></button>
            </div>
            {expanded === meeting.id && <div className="meeting-detail"><p>{meeting.detail}</p>{meeting.status === 'cancelled' && <button type="button" onClick={() => notify('Rescheduling will be available when live meetings launch.')}>Reschedule preview</button>}</div>}
          </article>;
        })}{filtered.length === 0 && <div className="meeting-empty"><CalendarDays /><h4>No matching meetings</h4><p>Try another collaborator or choose a different status.</p><button type="button" onClick={() => setQuery('')}>Clear search</button></div>}</div>
      </section>

      <aside className="meeting-feature" aria-label="Next sample collaboration">
        <span className="meeting-feature-label">NEXT COLLABORATION</span>
        <div className="meeting-feature-avatars"><img src={creators[0].image} alt="" /><img src={creators[1].image} alt="" /><span>2</span></div>
        <div><p>{nextMeeting.time}</p><h3>{nextMeeting.title}</h3><p>Shape the final film together before the first private screening.</p></div>
        <dl><div><dt>With</dt><dd>{nextMeeting.collaborator}</dd></div><div><dt>Duration</dt><dd>{nextMeeting.duration}</dd></div></dl>
        <button type="button" aria-label={`Open featured meeting preview for ${nextMeeting.title}`} onClick={() => previewJoin(nextMeeting)}>Open meeting preview <ChevronRight /></button>
      </aside>
    </div>
    {feedback && <p className="meeting-feedback" role="status">{feedback}</p>}
  </section>;
}
