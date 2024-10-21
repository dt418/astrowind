import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

import { env } from './src/data/env/server';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL not found on .env');

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
