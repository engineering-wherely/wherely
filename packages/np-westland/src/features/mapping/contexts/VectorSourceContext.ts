import type { Nullable } from '@/types/common';
import type VectorSource from 'ol/source/Vector';
import { createContext } from 'react';

export const VectorSourceContext = createContext<Nullable<VectorSource>>(null);
