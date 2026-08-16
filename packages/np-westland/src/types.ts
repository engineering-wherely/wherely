export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = Nullable<Optional<T>>;

export type { default as MappingService } from '@/features/mapping/services/MappingService';
