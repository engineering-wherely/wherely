import { makeForeignId, makeId } from "@/db/column-helpers";
import { mixedGeometry } from "@/db/custom-types";
import { sql } from "drizzle-orm";
import { check, snakeCase, varchar } from "drizzle-orm/pg-core";
import { compositeFormsTable, formsTable } from "./forms";

export const geoLayersTable = snakeCase.table("geo_layers", {
  id: makeId(),
  name: varchar({ length: 256 }),
});

export const geoFeaturesTable = snakeCase.table(
  "geo_features",
  {
    id: makeId(),
    layerId: makeForeignId(geoLayersTable.id),
    geometry: mixedGeometry(),
    formId: makeForeignId(formsTable.id),
    compositeFormId: makeForeignId(compositeFormsTable.id),
  },
  (t) => [
    check(
      "geo_features_at_most_one_form",
      sql`${t.formId} IS NULL OR ${t.compositeFormId} IS NULL`,
    ),
  ],
);
