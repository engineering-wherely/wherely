import {
  bigint,
  type PgBigInt53,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const makeId = () =>
  bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity();

export const makeForeignId = (id: PgBigInt53) =>
  bigint({ mode: "number" })
    .references(() => id)
    .notNull();

export const makeName = () => varchar({ length: 256 }).notNull();

export const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};
