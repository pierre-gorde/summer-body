import 'dotenv/config';
import { z } from 'zod';
import { DEFAULT_PORT } from './constants/config.js';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  DATABASE_URL: z.string().url(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | undefined;

export function loadEnv(): Env {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
