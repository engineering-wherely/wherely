export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = Nullable<Optional<T>>;

declare const brand: unique symbol;

export type Branded<T, TBrand extends string> = T & {
  readonly [brand]: TBrand;
};
