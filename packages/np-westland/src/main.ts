import '@/index.css';

// shadcn/ui components
export { Button, buttonVariants } from '@/shared/components/ui/button';

// homemade components
export { default as MapArtisan } from '@/features/mapping/components/MapArtisan';

export type { MappingService } from '@/features/mapping/services/service';

export { MappingContextProvider } from '@/features/mapping/components/MappingContextProvider';
