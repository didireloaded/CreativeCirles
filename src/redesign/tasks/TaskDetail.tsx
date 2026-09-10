import { FileText, MessageCircle, Paperclip, X } from 'lucide-react';
import type { CreativeTask } from './model';

interface TaskDetailProps {
  task: CreativeTask;
  onClose: () => void;
  onChange: (task: CreativeTask) => void;
}

export default function TaskDetail({ task, onClose, onChange }: TaskDetailProps) {
  const completed = task.subtasks.filter(item => item.done).length;
  return <div className="task-detail-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="task-detail" role="dialog" aria-modal="true" aria-labelledby="task-detail-title">
      <header><div><p className="eyebrow">{task.source} task</p><h2 id="task-detail-title">{task.title}</h2></div><button type="button" aria-label="Close task details" onClick={onClose}><X /></button></header>
      <p className="task-detail-description">{task.description || 'Add the next useful detail when you are ready.'}</p>
      <div className="task-detail-meta"><span>{task.priority} priority</span><span>{task.durationMinutes} min focus</span><span>{task.status.replace('-', ' ')}</span></div>
      <section className="task-checklist"><div><h3>Checklist</h3><span>{completed} of {task.subtasks.length} steps complete</span></div>{task.subtasks.length ? task.subtasks.map(item => <label key={item.id}><input type="checkbox" checked={item.done} onChange={() => onChange({ ...task, subtasks: task.subtasks.map(current => current.id === item.id ? { ...current, done: !current.done } : current) })} /><span>{item.label}</span></label>) : <p>No checklist items yet.</p>}</section>
      <section className="task-files"><div><Paperclip /><h3>Files</h3></div>{task.attachments.length ? task.attachments.map(file => <span key={file}><FileText />{file}</span>) : <p>No files attached.</p>}</section>
      <section className="task-activity"><div><MessageCircle /><h3>Activity</h3></div><p>This task is saved on this device. Team activity will appear here after the live workspace is connected.</p></section>
    </section>
  </div>;
}
