import type { Nullable } from '@/types/common';
import type LayerGroup from 'ol/layer/Group';
import { createContext } from 'react';

export const LayersContext = createContext<Nullable<LayerGroup>>(null);
