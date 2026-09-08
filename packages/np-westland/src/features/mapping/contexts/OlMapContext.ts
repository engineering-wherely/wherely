import type { Nullable } from '@/types/common';
import type OlMap from 'ol/Map';
import { createContext } from 'react';

export const OlMapContext = createContext<Nullable<OlMap>>(null);
