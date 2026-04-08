/**
 * Static runtime configuration constants.
 * Anything sourced from environment variables lives in `env.ts` instead.
 */

export const DEFAULT_PORT = 3000;

/** JWT signing algorithm. HS256 = HMAC with SHA-256, symmetric secret. */
export const JWT_ALGORITHM = 'HS256';

/** Lifetime of an issued session JWT. */
export const JWT_EXPIRES_IN = '30d';

/** Issuer claim included in every JWT we sign. */
export const JWT_ISSUER = 'summer-body-api';

/** Audience claim required when verifying a JWT. */
export const JWT_AUDIENCE = 'summer-body-mobile';
