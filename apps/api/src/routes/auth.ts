import { Hono } from 'hono';
import { z } from 'zod';
import { ValidationError } from '../errors/app-error.js';
import { verifyGoogleIdToken } from '../services/google-auth.js';
import { signSessionToken } from '../services/jwt.js';
import { upsertUserFromGoogle } from '../services/users.js';

const GoogleSignInSchema = z.object({
  idToken: z.string().min(1),
});

export const authRoutes = new Hono();

authRoutes.post('/google', async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = GoogleSignInSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
  }

  const identity = await verifyGoogleIdToken(parsed.data.idToken);
  const user = await upsertUserFromGoogle(identity);
  const token = await signSessionToken({ userId: user.id });

  return c.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  });
});
