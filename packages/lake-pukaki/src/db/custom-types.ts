import { customType } from "drizzle-orm/pg-core";

/**
 * Mixed 2D PostGIS geometries in WGS 84 (longitude, latitude).
 * Write WKT/EWKT or hexadecimal EWKB strings; node-postgres reads hexadecimal
 * EWKB strings. Use ST_AsGeoJSON in queries when GeoJSON output is needed.
 */
export const mixedGeometry = customType<{ data: string; driverData: string }>({
  dataType() {
    return "geometry(Geometry,4326)";
  },
  // Do not apply Drizzle's point-only geometry codec to mixed shapes.
  codec: undefined,
  toDriver(value) {
    return value;
  },
  fromDriver(value) {
    return value;
  },
});
