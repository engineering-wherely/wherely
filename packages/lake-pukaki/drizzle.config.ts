import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { readFileSync } from "node:fs";

const rdsEndpoint = process.env.RDS_ENDPOINT;
const rdsCaPath = process.env.RDS_CA_PATH;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Set DATABASE_URL to a PostgreSQL connection string.");
}

const databaseUrl = new URL(connectionString);
// Neon URLs carry their own TLS settings, even when RDS variables remain set.
const isNeon = databaseUrl.hostname.endsWith(".neon.tech");
const useRdsTls = !isNeon && rdsEndpoint && rdsCaPath;

if (!isNeon && Boolean(rdsEndpoint) !== Boolean(rdsCaPath)) {
  throw new Error(
    "Set both RDS_ENDPOINT and RDS_CA_PATH to enable verified TLS.",
  );
}

if (useRdsTls) {
  if (
    ["sslmode", "sslrootcert", "sslcert", "sslkey", "ssl"].some((key) =>
      databaseUrl.searchParams.has(key),
    )
  ) {
    throw new Error(
      "Remove SSL parameters from DATABASE_URL; TLS is configured using RDS_ENDPOINT and RDS_CA_PATH.",
    );
  }
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
  // Kit ignores a separate SSL object when credentials use the `url` form.
  dbCredentials:
    useRdsTls
      ? {
          host: databaseUrl.hostname,
          port: Number(databaseUrl.port || 5432),
          user: decodeURIComponent(databaseUrl.username),
          password: decodeURIComponent(databaseUrl.password),
          database: decodeURIComponent(databaseUrl.pathname.slice(1)),
          ssl: {
            ca: readFileSync(rdsCaPath, "utf8"),
            rejectUnauthorized: true,
            servername: rdsEndpoint,
          },
        }
      : { url: connectionString },
});
