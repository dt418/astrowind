import { sql } from 'drizzle-orm';
import { db } from '.';

async function reset() {
  console.log('Starting database reset process...');
  const tableSchema = db._.schema;
  if (!tableSchema) {
    throw new Error('No table schema found');
  }

  console.log('🗑️ Preparing to empty the entire database');
  const queries = Object.values(tableSchema).map((table) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return sql.raw(`TRUNCATE TABLE ${table.dbName} CASCADE;`);
  });

  console.log('Executing delete queries...');

  try {
    await db.transaction(async (tx) => {
      for (const query of queries) {
        if (query) {
          await tx.execute(query);
          console.log(`✅ Cleared table: ${query}`);
        }
      }
    });
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}

reset()
  .then(() => {
    console.log('Database reset script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database reset script failed:', error);
    process.exit(1);
  });
