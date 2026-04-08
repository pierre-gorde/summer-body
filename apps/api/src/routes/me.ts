import { Hono } from 'hono';
import { NotFoundError } from '../errors/app-error.js';
import { type AuthenticatedVariables, requireAuth } from '../middleware/require-auth.js';
import { findUserById } from '../services/users.js';

export const meRoutes = new Hono<{ Variables: AuthenticatedVariables }>();

meRoutes.use('*', requireAuth);

meRoutes.get('/', async (c) => {
  const userId = c.get('userId');
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('User not found');

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
});
