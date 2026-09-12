import { useContext, useSyncExternalStore } from 'react';
import { DomainContext } from './context';

export function useProductDomain() {
  const repository = useContext(DomainContext);
  if (!repository) throw new Error('useProductDomain must be used inside DomainProvider');
  const state = useSyncExternalStore(repository.subscribe, repository.getSnapshot, repository.getSnapshot);
  return { state, toggleSaved: repository.toggleSaved, reset: repository.reset };
}
