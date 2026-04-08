import {
  ERR_CONFLICT,
  ERR_FORBIDDEN,
  ERR_NOT_FOUND,
  ERR_UNAUTHORIZED,
  ERR_VALIDATION,
} from '../constants/errors.js';

/**
 * Base class for all expected, client-facing errors.
 * Anything thrown that isn't an AppError is treated as ERR_INTERNAL.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;

  constructor(code: string, message: string, httpStatus: number) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(ERR_VALIDATION, message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(code: string = ERR_UNAUTHORIZED, message = 'Unauthorized') {
    super(code, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(ERR_FORBIDDEN, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(ERR_NOT_FOUND, message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(ERR_CONFLICT, message, 409);
  }
}
