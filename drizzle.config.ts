import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env');

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
