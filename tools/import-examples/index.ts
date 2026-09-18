import { Pool } from 'pg'

import { importStreets } from './scripts/import-streets.ts'
import { importUser } from './scripts/import-user.ts'

process.loadEnvFile('.env')

async function runImport() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Silence "PostgresError: no pg_hba.conf entry" error
    // Uncomment this part to populate a Heroku db
    // ssl: {
    //   rejectUnauthorized: false
    // }
  })

  const client = await pool.connect()

  // Inserts or updates the example user + streets in one transaction.
  try {
    await client.query('BEGIN')

    const userResult = await importUser(client)
    if (userResult.rowCount === 1) {
      console.log('User added or updated.')
    }

    const streetsResult = await importStreets(client)
    console.log(`${streetsResult.rowCount} streets added or updated.`)

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')

    console.error('Error, rolling back')

    throw error
  } finally {
    client.release()
    await pool.end()

    console.log('Done')
  }
}

runImport()
