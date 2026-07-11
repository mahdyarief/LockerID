import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Find and load .env.local from the monorepo root.
 * 
 * Searches common locations:
 * - From apps/web/ → ../../.env.local
 * - From packages/database/ → ../../.env.local
 * - From monorepo root → .env.local
 * 
 * Falls back to process.env if not found.
 */
export function loadEnvLocal(): void {
  const cwd = process.cwd();
  
  const candidates = [
    path.join(cwd, '../../.env.local'),  // From apps/web/ or packages/*/
    path.join(cwd, '.env.local'),        // From monorepo root
  ];
  
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dotenv.config({ path: candidate });
      return;
    }
  }
  
  console.warn('[@locker/env] .env.local not found, relying on process.env');
}

/**
 * Load environment variables immediately when imported.
 */
loadEnvLocal();
