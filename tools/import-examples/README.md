# Coastmix examples

## Requirements

This tool was written for Node v24+ as it runs TypeScript directly without
a transpiler (e.g. `tsx` or `tsc`.)

## Exporting existing example data

Examples were originally created on the Coastmix staging server. They can be
exported using this SQL query:

```sql
SELECT json_agg(row_to_json(s))
FROM public."Streets" s
WHERE creator_id = 'examples';
```

This creates a JSON file which is extremely portable and can be edited manually
if data needs to be changed before inserting or updating into another database.

## Importing data

Populate the `.env` file with your database connection information, then run:

```sh
node ./tools/import-examples/index.ts
```

This script does two things.

1. Creates the `examples` user, if it doesn't already exist
2. Inserts or updates streets.

The script does not bail if existing user or streets are present. It WILL
overwrite data. Ensure that the existing user or streets on the target database
are the ones you want to overwrite.
