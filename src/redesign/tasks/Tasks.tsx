import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, CheckCircle2, ChevronRight, CircleDashed, Clock3, Plus, Target, TimerReset, X } from 'lucide-react';
import type { OnboardingProfile } from '../onboarding/model';
import { creators } from '../data';
import TaskDetail from './TaskDetail';
import { createTask, readTasks, writeTasks, type CreativeTask, type TaskDraft, type TaskStatus } from './model';
import './tasks.css';

interface TasksProps {
  notify: (message: string) => void;
  profile: OnboardingProfile;
  pendingDraft: TaskDraft | null;
  onDraftConsumed: () => void;
}

type TaskView = 'Today' | 'All tasks' | 'Progress';
type TaskFilter = 'all' | 'in-progress' | 'completed' | 'overdue';
const dayKey = (value: Date) => `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;

export default function Tasks({ notify, profile, pendingDraft, onDraftConsumed }: TasksProps) {
  const [tasks, setTasks] = useState<CreativeTask[]>(readTasks);
  const [view, setView] = useState<TaskView>('Today');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [draftContext, setDraftContext] = useState<TaskDraft | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => { writeTasks(tasks); }, [tasks]);
  useEffect(() => {
    if (!pendingDraft) return;
    setTitle(pendingDraft.title);
    setDraftContext(pendingDraft);
    setShowCreate(true);
    onDraftConsumed();
  }, [pendingDraft, onDraftConsumed]);

  const today = useMemo(() => new Date(), []);
  const week = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() + index - 2); return date; });
  const visibleTasks = useMemo(() => tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (view === 'Today' && task.dueAt && dayKey(new Date(task.dueAt)) !== dayKey(today) && task.status !== 'overdue') return false;
    return true;
  }), [filter, tasks, today, view]);
  const done = tasks.filter(task => task.status === 'completed').length;
  const inProgress = tasks.filter(task => task.status === 'in-progress').length;
  const overdue = tasks.filter(task => task.status === 'overdue').length;
  const selectedTask = tasks.find(task => task.id === selected) || null;

  function updateTask(next: CreativeTask) {
    setTasks(current => current.map(task => task.id === next.id ? next : task));
  }

  function toggleComplete(task: CreativeTask) {
    const isComplete = task.status === 'completed';
    updateTask({ ...task, status: isComplete ? 'open' : 'completed' });
    const message = isComplete ? 'Task reopened' : 'Task completed';
    setFeedback(message);
    notify(message);
  }

  function addTask(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const task = createTask({ source: draftContext?.source || 'manual', title: cleanTitle, relatedId: draftContext?.relatedId, dueAt: draftContext?.dueAt, assigneeIds: draftContext?.assigneeIds });
    setTasks(current => [task, ...current]);
    setTitle('');
    setDraftContext(null);
    setShowCreate(false);
    setView('All tasks');
    setFeedback('Task added');
    notify('Task added to your creative plan.');
  }

  return <main className="tasks-page">
    <header className="tasks-header"><div><p className="eyebrow">THE WORK BEHIND THE WORK</p><h1>Your tasks</h1><p>{profile.displayName || 'Jordan'}, keep the next move clear.</p></div><button type="button" className="tasks-create-button" onClick={() => setShowCreate(true)}><Plus /> <span>New task</span></button></header>
    <nav className="tasks-tabs" aria-label="Task views">{(['Today', 'All tasks', 'Progress'] as const).map(item => <button type="button" key={item} className={view === item ? 'is-active' : ''} aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}</nav>

    {showCreate && <form className="task-create-form" onSubmit={addTask}><div><label htmlFor="task-title">What needs to move forward?</label><input id="task-title" autoFocus value={title} onChange={event => setTitle(event.target.value)} placeholder="Name the next useful action" required /></div><button type="submit">Add task <ArrowUpRight /></button><button type="button" aria-label="Close new task form" onClick={() => setShowCreate(false)}><X /></button></form>}

    <section className="task-summary" aria-label="Task summary"><article><CalendarDays /><span>Today</span><strong>{tasks.filter(task => task.dueAt && dayKey(new Date(task.dueAt)) === dayKey(today) && task.status !== 'completed').length}</strong><small>tasks</small></article><article><CircleDashed /><span>In progress</span><strong>{inProgress}</strong><small>active</small></article><article><TimerReset /><span>Past due</span><strong>{overdue}</strong><small>needs care</small></article><article><CheckCircle2 /><span>Completed</span><strong>{done}</strong><small>finished</small></article></section>

    {view === 'Progress' ? <section className="task-progress"><div className="task-progress-copy"><p className="eyebrow">YOUR CREATIVE RHYTHM</p><h2>{done} finished,<br />{tasks.length - done} still moving.</h2><p>A simple view of the work you have closed and what still needs your attention.</p></div><div className="task-progress-chart" role="img" aria-label={`${done} of ${tasks.length} tasks completed`}><div style={{ '--progress': `${Math.round(done / tasks.length * 100)}%` } as React.CSSProperties}><strong>{Math.round(done / tasks.length * 100)}%</strong><span>complete</span></div><dl><div><dt>In progress</dt><dd>{inProgress}</dd></div><div><dt>Past due</dt><dd>{overdue}</dd></div><div><dt>Total tasks</dt><dd>{tasks.length}</dd></div></dl></div></section> : <>
      <section className="task-date-strip" aria-label="Task week">{week.map(date => <button key={date.toISOString()} type="button" className={dayKey(date) === dayKey(today) ? 'is-today' : ''}><span>{date.toLocaleDateString('en-GB', { weekday: 'short' })}</span><strong>{date.getDate()}</strong></button>)}</section>
      <div className="task-list-heading"><div><h2>{view === 'Today' ? 'Today’s focus' : 'Everything in motion'}</h2><span>{visibleTasks.length} tasks</span></div><div className="task-filters" aria-label="Task status filters">{([{ value: 'all', label: 'All' }, { value: 'in-progress', label: 'In progress' }, { value: 'completed', label: 'Completed' }, { value: 'overdue', label: 'Past due' }] as const).map(item => <button type="button" key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div></div>
      <section className="task-list">{visibleTasks.map(task => {
        const assignees = (task.assigneeIds || []).map(id => creators.find(creator => creator.id === id)).filter(Boolean);
        return <article className={`task-card task-${task.priority}`} key={task.id}><label className="task-complete"><input type="checkbox" checked={task.status === 'completed'} aria-label={`${task.status === 'completed' ? 'Reopen' : 'Complete'} ${task.title}`} onChange={() => toggleComplete(task)} /><span /></label><div className="task-card-copy"><div><span className="task-source">{task.source}</span><span className={`task-status task-status-${task.status}`}>{task.status.replace('-', ' ')}</span></div><h3>{task.title}</h3><p>{task.description || 'A new task ready for the next detail.'}</p><div className="task-meta"><span><Clock3 />{task.dueAt ? new Date(task.dueAt).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : 'No due date'}</span><span><Target />{task.durationMinutes} min</span>{assignees.length > 0 && <span className="task-assignees">{assignees.map(creator => <img key={creator!.id} src={creator!.image} alt={creator!.name} />)}</span>}</div></div><button type="button" className="task-open" aria-label={`Open ${task.title}`} onClick={() => setSelected(task.id)}><ChevronRight /></button></article>;
      })}{visibleTasks.length === 0 && <div className="task-empty"><CheckCircle2 /><h3>Nothing waiting here.</h3><p>Choose another view or add the next useful task.</p><button type="button" onClick={() => setShowCreate(true)}>Create a task</button></div>}</section>
    </>}
    {feedback && <p className="task-feedback" role="status">{feedback}</p>}
    {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelected(null)} onChange={updateTask} />}
  </main>;
}
