import type { MiddlewareHandler } from 'hono';
import { ERR_AUTH_MISSING_BEARER } from '../constants/errors.js';
import { UnauthorizedError } from '../errors/app-error.js';
import { verifySessionToken } from '../services/jwt.js';

export interface AuthenticatedVariables {
  userId: string;
}

const BEARER_PREFIX = 'Bearer ';

export const requireAuth: MiddlewareHandler<{ Variables: AuthenticatedVariables }> = async (
  c,
  next,
) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError(ERR_AUTH_MISSING_BEARER, 'Missing bearer token');
  }
  const token = header.slice(BEARER_PREFIX.length);
  const payload = await verifySessionToken(token);
  c.set('userId', payload.userId);
  await next();
};
