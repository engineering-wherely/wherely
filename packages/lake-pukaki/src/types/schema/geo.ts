import { geoFeaturesTable, geoLayersTable } from "@/db/schema/geo";
import { createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";
import { string } from "zod";

export const geoLayersSelectSchema = createSelectSchema(geoLayersTable);
export type GeoLayer = z.infer<typeof geoLayersSelectSchema>;

export const geoFeaturesSelectSchema = createSelectSchema(geoFeaturesTable, {
  geometry: string(),
});
export type GeoFeature = z.infer<typeof geoFeaturesSelectSchema>;
