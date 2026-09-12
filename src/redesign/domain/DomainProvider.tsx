import { useRef, type ReactNode } from 'react';
import { createProductRepository, type ProductRepository } from './repository';
import { DomainContext } from './context';

export function DomainProvider({ children }: { children: ReactNode }) {
  const repository = useRef<ProductRepository>();
  if (!repository.current) repository.current = createProductRepository();
  return <DomainContext.Provider value={repository.current}>{children}</DomainContext.Provider>;
}
