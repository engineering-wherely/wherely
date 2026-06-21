import '@/index.css';

// shadcn/ui components
export { Button, buttonVariants } from '@/components/ui/button';

// homemade components
export { default as MapArtisan } from '@/components/mapping/MapArtisan';

export type { MappingService } from '@/services/mapping/service';

export { MappingContextProvider } from '@/components/mapping/MappingContextProvider';
