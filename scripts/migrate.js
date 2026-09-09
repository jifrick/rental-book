import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://postgres.lnyxbeiswymdrpndoime:pfiC692aFN99VnFD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const seedPath = path.join(__dirname, '../supabase/seed.sql');

    console.log('Reading schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying schema.sql...');
    await client.query(schemaSql);
    console.log('Schema applied successfully! ✓');

    console.log('Reading seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('Applying seed.sql...');
    await client.query(seedSql);
    console.log('Seed data applied successfully! ✓');

    console.log('\nAll Supabase database migrations completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
