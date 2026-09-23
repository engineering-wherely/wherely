import type { Nullable } from '@/types/common';
import { createContext } from 'react';

export const ControlsContext = createContext<Nullable<HTMLElement>>(null);
