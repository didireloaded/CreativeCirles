import type { ReactNode } from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

type Action = { label: string; onClick: () => void };

export function Skeleton({ variant = 'card', count = 1 }: { variant?: 'text' | 'avatar' | 'card' | 'feed'; count?: number }) {
  return <div className={`ui-skeleton-group ui-skeleton-${variant}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <i className="ui-skeleton" key={index} />)}
  </div>;
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: Action }) {
  return <section className="ui-state ui-empty-state">
    <span className="ui-state-icon" aria-hidden="true">{icon || <Inbox />}</span>
    <h3>{title}</h3><p>{description}</p>
    {action && <button className="button primary" onClick={action.onClick}>{action.label}</button>}
  </section>;
}

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry: () => void }) {
  return <section className="ui-state ui-error-state" role="alert">
    <span className="ui-state-icon" aria-hidden="true"><AlertCircle /></span>
    <h3>{title}</h3><p>{description}</p>
    <button className="button primary" onClick={onRetry}><RefreshCw />Retry</button>
  </section>;
}
