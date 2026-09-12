import { createContext } from 'react';
import type { ProductRepository } from './repository';

export const DomainContext = createContext<ProductRepository | null>(null);
