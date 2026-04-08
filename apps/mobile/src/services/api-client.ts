/**
 * Tiny typed fetch wrapper around the API.
 * Adds JSON headers and a Bearer token when provided.
 * Throws ApiError with the server's error code on 4xx/5xx.
 */
import { API_BASE_URL } from '../config/env';

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.status = status;
    this.code = payload.code;
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const errorPayload: ApiErrorPayload = data?.error ?? {
      code: 'ERR_UNKNOWN',
      message: 'Unknown error',
    };
    throw new ApiError(response.status, errorPayload);
  }

  return data as T;
}
