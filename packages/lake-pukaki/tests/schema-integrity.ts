import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  generateDrizzleJson,
  generateMigration,
} from "drizzle-kit/api-postgres";
import * as forms from "../src/db/schema/forms";
import * as bindings from "../src/db/schema/bindings";

// Uses the project's PostgreSQL image in a disposable container, without ports or volumes.
const container = `lake-pukaki-test-${randomUUID()}`;
const docker = (args: string[], input?: string) =>
  execFileSync("docker", args, {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
const client = {
  async query(statement: string) {
    try {
      return docker(
        [
          "exec",
          "-i",
          container,
          "psql",
          "-U",
          "postgres",
          "-v",
          "ON_ERROR_STOP=1",
          "-v",
          "VERBOSITY=verbose",
        ],
        statement,
      );
    } catch (error) {
      const stderr = String((error as { stderr?: string }).stderr);
      throw Object.assign(new Error(stderr), {
        code: stderr.match(/ERROR:\s+([A-Z0-9]{5}):/)?.[1],
      });
    }
  },
};
let started = false;
try {
  docker([
    "run",
    "--pull=never",
    "--rm",
    "-d",
    "--name",
    container,
    "-e",
    "POSTGRES_HOST_AUTH_METHOD=trust",
    "nickblah/postgis:18-postgis-3.6.4",
  ]);
  started = true;
  for (let attempt = 0; ; attempt++) {
    try {
      docker([
        "exec",
        container,
        "pg_isready",
        "-h",
        "127.0.0.1",
        "-U",
        "postgres",
      ]);
      break;
    } catch (error) {
      if (attempt === 60) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  const empty = await generateDrizzleJson({});
  const schema = await generateDrizzleJson({ ...forms, ...bindings }, empty.id);
  for (const statement of await generateMigration(empty, schema)) {
    await client.query(statement);
  }

  await client.query(`
    INSERT INTO forms (id, name, type) OVERRIDING SYSTEM VALUE VALUES
      (1, 'A', 'simple_form'), (2, 'B', 'simple_form'),
      (3, 'Outer', 'composite_form'), (4, 'Inner', 'composite_form');
    INSERT INTO fields (id, name, type, simple_form_id) OVERRIDING SYSTEM VALUE VALUES
      (1, 'A field', 'text', 1), (2, 'B field', 'text', 2);
    INSERT INTO form_compositions (id, name, composite_form_id, member_type, member_id) OVERRIDING SYSTEM VALUE VALUES
      (1, 'Inner', 3, 'composite_form', 4),
      (2, 'Home address', 4, 'simple_form', 1),
      (3, 'Postal address', 4, 'simple_form', 1),
      (4, 'Other address', 3, 'simple_form', 1);
    INSERT INTO form_inputs (id, form_id, form_type) OVERRIDING SYSTEM VALUE VALUES
      (10, 3, 'composite_form'), (13, 2, 'simple_form'), (14, 1, 'simple_form'), (15, 1, 'simple_form');
    INSERT INTO form_inputs (id, parent_id, parent_form_id, composition_id, form_id, form_type) OVERRIDING SYSTEM VALUE
      VALUES (11, 10, 3, 1, 4, 'composite_form');
    INSERT INTO form_inputs (id, parent_id, parent_form_id, composition_id, form_id, form_type) OVERRIDING SYSTEM VALUE
      VALUES (12, 11, 4, 2, 1, 'simple_form'), (16, 11, 4, 3, 1, 'simple_form');
    INSERT INTO field_inputs (form_input_id, field_id, form_id, value) VALUES (12, 1, 1, 'valid');
    INSERT INTO form_bindings (id, form_subject_type, form_id, form_type) OVERRIDING SYSTEM VALUE
      VALUES (1, 'geo_feature', 1, 'simple_form'), (2, 'geo_feature', 3, 'composite_form');
    INSERT INTO form_input_bindings (form_binding_id, form_input_id, form_id, form_type)
      VALUES (1, 12, 1, 'simple_form'), (2, 10, 3, 'composite_form');
  `);

  // Explicit fixture IDs must not collide with subsequent generated IDs.
  for (const table of [
    "forms",
    "fields",
    "form_compositions",
    "form_inputs",
    "form_bindings",
  ]) {
    await client.query(
      `SELECT setval(pg_get_serial_sequence('${table}', 'id'), 100)`,
    );
  }

  // Creation uses the database identity and generated form kind, then allows
  // removal when no recorded input refers to the field.
  const created = await client.query(`
    INSERT INTO fields (name, description, type, required, simple_form_id)
      SELECT BTRIM('  New field  '), NULL, CAST('text' AS field_type), false, 1
      WHERE LENGTH(BTRIM('  New field  ')) > 0
      RETURNING id, name, type, required, simple_form_id, form_type;
  `);
  assert.match(created, /New field/);
  assert.match(created, /simple_form/);
  const removed = await client.query(
    "DELETE FROM fields WHERE name = 'New field' RETURNING id",
  );
  assert.match(removed, /DELETE 1/);

  await client.query(`
    INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type, "index")
      VALUES (11, 4, 2, 1, 'simple_form', 1);
  `);

  // Amplify binds each occurrence separately. PREPARE without declared types
  // exercises PostgreSQL parameter inference, including a nullable parent.
  const parameterizedInputSql = `
    INSERT INTO form_inputs (form_id, form_type, parent_id, parent_form_id, composition_id, index)
    SELECT f.id, f.type, $1, p.form_id, $2, $3
    FROM forms f LEFT JOIN form_inputs p ON p.id = $4
    WHERE f.id = $5 AND $6 >= 0 AND (CAST($7 AS bigint) IS NULL OR p.id IS NOT NULL)
    RETURNING *
  `;
  await assert.rejects(
    client.query(
      `PREPARE broken_input AS ${parameterizedInputSql.replace("CAST($7 AS bigint)", "$7")}`,
    ),
    (error: unknown) => (error as { code?: string }).code === "42P18",
  );
  const parameterizedInputs = await client.query(`
    BEGIN;
    PREPARE create_input AS ${parameterizedInputSql};
    EXECUTE create_input(NULL, NULL, 0, NULL, 3, 0, NULL);
    EXECUTE create_input(10, 4, 2, 10, 1, 2, 10);
    EXECUTE create_input(999999, 4, 2, 999999, 1, 2, 999999);
    EXECUTE create_input(NULL, NULL, -1, NULL, 3, -1, NULL);
    DEALLOCATE create_input;
    ROLLBACK;
  `);
  assert.equal((parameterizedInputs.match(/INSERT 0 1/g) ?? []).length, 2);
  assert.equal((parameterizedInputs.match(/INSERT 0 0/g) ?? []).length, 2);

  // Exercise input creation with database-assigned IDs and copied ownership.
  await client.query(`
    DO $$
    DECLARE root_id bigint; child_id bigint; field_input_id bigint; stored_value text;
    BEGIN
      INSERT INTO form_inputs (form_id, form_type, parent_id, parent_form_id, composition_id, index)
        SELECT f.id, f.type, NULL, p.form_id, NULL, 0
        FROM forms f LEFT JOIN form_inputs p ON p.id = NULL
        WHERE f.id = 3 RETURNING id INTO root_id;
      INSERT INTO form_inputs (form_id, form_type, parent_id, parent_form_id, composition_id, index)
        SELECT f.id, f.type, root_id, p.form_id, 4, 0
        FROM forms f LEFT JOIN form_inputs p ON p.id = root_id
        WHERE f.id = 1 RETURNING id INTO child_id;
      INSERT INTO field_inputs (form_input_id, field_id, form_id, value)
        SELECT i.id, 1, i.form_id, '' FROM form_inputs i WHERE i.id = child_id
        RETURNING id, value INTO field_input_id, stored_value;
      IF stored_value IS DISTINCT FROM '' THEN
        RAISE EXCEPTION 'Empty string was not preserved';
      END IF;
      BEGIN
        DELETE FROM form_inputs WHERE id = child_id;
        RAISE EXCEPTION 'Deleted input with field values';
      EXCEPTION WHEN foreign_key_violation THEN
        NULL;
      END;
      BEGIN
        DELETE FROM form_inputs WHERE id = root_id;
        RAISE EXCEPTION 'Deleted input with children';
      EXCEPTION WHEN foreign_key_violation THEN
        NULL;
      END;
      DELETE FROM field_inputs WHERE id = field_input_id;
      INSERT INTO field_inputs (form_input_id, field_id, form_id, value)
        SELECT i.id, 1, i.form_id, NULL FROM form_inputs i WHERE i.id = child_id
        RETURNING id, value INTO field_input_id, stored_value;
      IF stored_value IS NOT NULL THEN
        RAISE EXCEPTION 'Null value was not preserved';
      END IF;
      DELETE FROM field_inputs WHERE id = field_input_id;
      DELETE FROM form_inputs WHERE id = child_id;
      DELETE FROM form_inputs WHERE id = root_id;
    END $$;
  `);

  const rejected: [string, string, string][] = [
    [
      "duplicate slot instance",
      "23505",
      "INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type) VALUES (11, 4, 2, 1, 'simple_form')",
    ],
    [
      "slot from another parent form",
      "23503",
      "INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type) VALUES (11, 4, 4, 1, 'simple_form')",
    ],
    [
      "missing slot",
      "23503",
      "INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type) VALUES (11, 4, 999, 1, 'simple_form')",
    ],
    [
      "child without slot",
      "23514",
      "INSERT INTO form_inputs (parent_id, parent_form_id, form_id, form_type) VALUES (11, 4, 1, 'simple_form')",
    ],
    [
      "root with slot",
      "23514",
      "INSERT INTO form_inputs (composition_id, form_id, form_type) VALUES (2, 1, 'simple_form')",
    ],
    [
      "missing input form",
      "23503",
      "INSERT INTO form_inputs (form_id, form_type) VALUES (999, 'simple_form')",
    ],
    [
      "wrong input form type",
      "23503",
      "INSERT INTO form_inputs (form_id, form_type) VALUES (1, 'composite_form')",
    ],
    [
      "missing composition member",
      "23503",
      "INSERT INTO form_compositions (name, composite_form_id, member_type, member_id) VALUES ('Member', 3, 'simple_form', 999)",
    ],
    [
      "simple composition owner",
      "23503",
      "INSERT INTO form_compositions (name, composite_form_id, member_type, member_id) VALUES ('Member', 1, 'simple_form', 2)",
    ],
    [
      "missing binding form",
      "23503",
      "INSERT INTO form_bindings (form_subject_type, form_id, form_type) VALUES ('geo_layer', 999, 'simple_form')",
    ],
    [
      "missing parent",
      "23503",
      "INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type) VALUES (999, 4, 2, 1, 'simple_form')",
    ],
    [
      "incomplete parent identity",
      "23514",
      "INSERT INTO form_inputs (parent_id, form_id, form_type) VALUES (11, 1, 'simple_form')",
    ],
    [
      "parent identity without input",
      "23514",
      "INSERT INTO form_inputs (parent_form_id, form_id, form_type) VALUES (4, 1, 'simple_form')",
    ],
    [
      "simple input parent",
      "23503",
      "INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type) VALUES (14, 1, 2, 2, 'simple_form')",
    ],
    [
      "child outside composition",
      "23503",
      "INSERT INTO form_inputs (parent_id, parent_form_id, composition_id, form_id, form_type, \"index\") VALUES (10, 3, 1, 2, 'simple_form', 1)",
    ],
    [
      "wrong field form",
      "23503",
      "INSERT INTO field_inputs (form_input_id, field_id, form_id) VALUES (12, 2, 1)",
    ],
    [
      "spoofed field form",
      "23503",
      "INSERT INTO field_inputs (form_input_id, field_id, form_id) VALUES (12, 2, 2)",
    ],
    [
      "composite field input",
      "23503",
      "INSERT INTO field_inputs (form_input_id, field_id, form_id) VALUES (10, 1, 1)",
    ],
    [
      "wrong binding input",
      "23503",
      "INSERT INTO form_input_bindings (form_binding_id, form_input_id, form_id, form_type) VALUES (1, 13, 1, 'simple_form')",
    ],
    [
      "spoofed binding form",
      "23503",
      "INSERT INTO form_input_bindings (form_binding_id, form_input_id, form_id, form_type) VALUES (1, 13, 2, 'simple_form')",
    ],
    [
      "duplicate null subject",
      "23505",
      "INSERT INTO form_bindings (id, form_subject_type, form_id, form_type) OVERRIDING SYSTEM VALUE VALUES (20, 'geo_feature', 1, 'simple_form')",
    ],
    [
      "duplicate null input subject",
      "23505",
      "INSERT INTO form_input_bindings (form_binding_id, form_input_id, form_id, form_type) VALUES (1, 12, 1, 'simple_form')",
    ],
    [
      "delete field with recorded input",
      "23503",
      "DELETE FROM fields WHERE id = 1",
    ],
    ["delete referenced form", "23503", "DELETE FROM forms WHERE id = 1"],
    [
      "delete referenced parent",
      "23503",
      "DELETE FROM form_inputs WHERE id = 11",
    ],
    [
      "change field ownership",
      "23503",
      "UPDATE fields SET simple_form_id = 2 WHERE id = 1",
    ],
    [
      "change binding form",
      "23503",
      "UPDATE form_bindings SET form_id = 2 WHERE id = 1",
    ],
    [
      "remove used composition",
      "23503",
      "DELETE FROM form_compositions WHERE composite_form_id = 4",
    ],
  ];
  for (const [name, code, statement] of rejected) {
    await assert.rejects(
      client.query(statement),
      (error: unknown) => {
        assert.equal((error as { code?: string }).code, code, name);
        return true;
      },
      name,
    );
  }
  console.log(
    `Schema integrity passed: valid nested/simple/composite submissions and ${rejected.length} rejected writes.`,
  );
} finally {
  if (started) {
    docker(["rm", "-f", container]);
  }
}
