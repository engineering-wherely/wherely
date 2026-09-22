import { makeForeignId, makeId } from "@/db/column-helpers";
import { mixedGeometry } from "@/db/custom-types";
import { snakeCase, varchar } from "drizzle-orm/pg-core";

export const geoLayersTable = snakeCase.table("geo_layers", {
  id: makeId(),
  name: varchar({ length: 256 }).notNull(),
});

export const geoFeaturesTable = snakeCase.table("geo_features", {
  id: makeId(),
  geoLayerId: makeForeignId(geoLayersTable.id).notNull(),
  geometry: mixedGeometry(),
});
