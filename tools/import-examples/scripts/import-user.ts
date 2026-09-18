import fs from 'node:fs/promises'
import { type PoolClient } from 'pg'

const USER_SQL_PATH = new URL('../data/example-user.sql', import.meta.url)

export async function importUser(client: PoolClient) {
  const sql = await fs.readFile(USER_SQL_PATH, 'utf8')
  const userResult = await client.query(sql)

  return userResult
}
