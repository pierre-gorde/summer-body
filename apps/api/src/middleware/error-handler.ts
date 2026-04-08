import type { ErrorHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { ERR_INTERNAL } from '../constants/errors.js';
import { AppError } from '../errors/app-error.js';

/**
 * Central error middleware. All routes throw — never `c.json(error)` inline.
 */
export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json(
      { error: { code: err.code, message: err.message } },
      err.httpStatus as ContentfulStatusCode,
    );
  }
  console.error('[unhandled]', err);
  return c.json({ error: { code: ERR_INTERNAL, message: 'Internal server error' } }, 500);
};
