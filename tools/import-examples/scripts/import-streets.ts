import fs from 'node:fs/promises'
import { type PoolClient } from 'pg'

const STREETS_JSON_PATH = new URL('../data/examples.json', import.meta.url)

export async function importStreets(client: PoolClient) {
  const streets = JSON.parse(await fs.readFile(STREETS_JSON_PATH, 'utf8'))

  // Error checking
  if (!Array.isArray(streets)) {
    throw new Error("streets_examples.json must contain a JSON array.")
  }

  for (const street of streets) {
    if (street.creator_id !== "examples") {
      throw new Error(
        `Refusing to import a row not owned by "examples" (row id: ${street.id ?? "unknown"}).`,
      )
    }
  }

  // Perform the query
  // Note this is only checking for conflicts matching the street's UUID
  // There is no table level constraint on creator_id + namespaced_id
  // Basically: do not ever change the street's UUID!
  const result = await client.query(
    `
      INSERT INTO public."Streets" (
        "id",
        "namespaced_id",
        "status",
        "name",
        "creator_id",
        "data",
        "created_at",
        "updated_at",
        "client_updated_at",
        "creator_ip",
        "original_street_id"
      )
      SELECT
        street.id,
        street.namespaced_id,
        street.status,
        street.name,
        street.creator_id,
        street.data,
        street.created_at,
        street.updated_at,
        street.client_updated_at,
        street.creator_ip,
        street.original_street_id
      FROM jsonb_array_elements($1::jsonb) AS input(row_json)
      CROSS JOIN LATERAL jsonb_populate_record(
        NULL::public."Streets",
        input.row_json
      ) AS street
      ON CONFLICT ("id") DO UPDATE
      SET
        "name" = EXCLUDED."name",
        "data" = EXCLUDED."data",
        "created_at" = EXCLUDED."created_at",
        "updated_at" = EXCLUDED."updated_at",
        "client_updated_at" = EXCLUDED."client_updated_at"
    `,
    [JSON.stringify(streets)],
  )

  return result
}
