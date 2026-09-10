export type TaskStatus = 'open' | 'in-progress' | 'awaiting-feedback' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSource = 'manual' | 'project' | 'collaboration' | 'job' | 'message' | 'event' | 'creator';

export interface TaskDraft {
  source: TaskSource;
  title: string;
  relatedId?: string;
  dueAt?: string;
  assigneeIds?: string[];
}

export interface CreativeTask extends TaskDraft {
  id: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  durationMinutes: number;
  subtasks: { id: string; label: string; done: boolean }[];
  attachments: string[];
}

export const taskStorageKey = 'creative-circle-tasks-v1';

const dayAt = (dayOffset: number, hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString();
};

export const taskSeed: CreativeTask[] = [
  {
    id: 'review-first-cut', source: 'project', relatedId: 'first-cut', title: 'Review the first cut',
    description: 'Watch the new sequence, collect pacing notes, and prepare focused feedback for Leo.',
    dueAt: dayAt(0, 16), assigneeIds: ['amara', 'leo'], status: 'in-progress', priority: 'high', durationMinutes: 45,
    subtasks: [{ id: 'watch', label: 'Watch the full sequence', done: true }, { id: 'notes', label: 'Add time-coded notes', done: false }],
    attachments: ['First-cut-v3.mp4'],
  },
  {
    id: 'campaign-board', source: 'collaboration', relatedId: 'nia', title: 'Build the campaign moodboard',
    description: 'Bring the visual references, palette, and styling direction into one shared board.',
    dueAt: dayAt(1, 11), assigneeIds: ['nia'], status: 'open', priority: 'medium', durationMinutes: 60,
    subtasks: [{ id: 'references', label: 'Collect visual references', done: false }], attachments: [],
  },
  {
    id: 'grant-application', source: 'job', relatedId: 'film-grant', title: 'Submit film grant application',
    description: 'Review the budget and submit the final application pack.',
    dueAt: dayAt(-1, 17), assigneeIds: [], status: 'overdue', priority: 'high', durationMinutes: 90,
    subtasks: [{ id: 'budget', label: 'Confirm production budget', done: true }, { id: 'submit', label: 'Submit application', done: false }], attachments: ['Grant-budget.pdf'],
  },
  {
    id: 'archive-selects', source: 'manual', title: 'Archive desert selects',
    description: 'Back up the approved selects and final colour exports.',
    dueAt: dayAt(-2, 15), assigneeIds: [], status: 'completed', priority: 'low', durationMinutes: 30,
    subtasks: [{ id: 'backup', label: 'Back up final exports', done: true }], attachments: [],
  },
];

const statuses: TaskStatus[] = ['open', 'in-progress', 'awaiting-feedback', 'completed', 'overdue'];
const priorities: TaskPriority[] = ['low', 'medium', 'high'];
const sources: TaskSource[] = ['manual', 'project', 'collaboration', 'job', 'message', 'event', 'creator'];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isTask(value: unknown): value is CreativeTask {
  if (!value || typeof value !== 'object') return false;
  const task = value as Record<string, unknown>;
  return typeof task.id === 'string' && typeof task.title === 'string' && typeof task.description === 'string'
    && statuses.includes(task.status as TaskStatus) && priorities.includes(task.priority as TaskPriority)
    && sources.includes(task.source as TaskSource) && typeof task.durationMinutes === 'number'
    && (task.relatedId === undefined || typeof task.relatedId === 'string')
    && (task.dueAt === undefined || typeof task.dueAt === 'string')
    && (task.assigneeIds === undefined || isStringArray(task.assigneeIds))
    && isStringArray(task.attachments)
    && Array.isArray(task.subtasks) && task.subtasks.every(subtask => Boolean(subtask) && typeof subtask === 'object'
      && typeof (subtask as Record<string, unknown>).id === 'string'
      && typeof (subtask as Record<string, unknown>).label === 'string'
      && typeof (subtask as Record<string, unknown>).done === 'boolean');
}

function cloneTasks(tasks: CreativeTask[]) {
  return tasks.map(task => ({ ...task, assigneeIds: [...(task.assigneeIds || [])], attachments: [...task.attachments], subtasks: task.subtasks.map(item => ({ ...item })) }));
}

export function readTasks(): CreativeTask[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(taskStorageKey) || 'null');
    if (Array.isArray(parsed) && parsed.every(isTask)) return cloneTasks(parsed);
  } catch { /* Fall back to useful preview content when storage is unavailable. */ }
  return cloneTasks(taskSeed);
}

export function writeTasks(tasks: CreativeTask[]) {
  try { localStorage.setItem(taskStorageKey, JSON.stringify(tasks)); }
  catch { /* State remains usable for the current visit. */ }
}

export function createTask(draft: TaskDraft): CreativeTask {
  return {
    ...draft,
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: draft.title.trim(),
    description: '',
    status: 'open',
    priority: 'medium',
    durationMinutes: 30,
    assigneeIds: [...(draft.assigneeIds || [])],
    subtasks: [],
    attachments: [],
  };
}
