/**
 * Stable error codes returned to clients.
 * Format: ERR_<DOMAIN>_<DETAIL>. Never reorder, never reuse.
 */

export const ERR_VALIDATION = 'ERR_VALIDATION';
export const ERR_UNAUTHORIZED = 'ERR_UNAUTHORIZED';
export const ERR_FORBIDDEN = 'ERR_FORBIDDEN';
export const ERR_NOT_FOUND = 'ERR_NOT_FOUND';
export const ERR_CONFLICT = 'ERR_CONFLICT';
export const ERR_INTERNAL = 'ERR_INTERNAL';

export const ERR_AUTH_INVALID_GOOGLE_TOKEN = 'ERR_AUTH_INVALID_GOOGLE_TOKEN';
export const ERR_AUTH_INVALID_JWT = 'ERR_AUTH_INVALID_JWT';
export const ERR_AUTH_MISSING_BEARER = 'ERR_AUTH_MISSING_BEARER';
