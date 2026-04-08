import { jwtVerify, SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_AUDIENCE, JWT_EXPIRES_IN, JWT_ISSUER } from '../constants/config.js';
import { ERR_AUTH_INVALID_JWT } from '../constants/errors.js';
import { loadEnv } from '../env.js';
import { UnauthorizedError } from '../errors/app-error.js';

export interface SessionPayload {
  userId: string;
}

function getSecret(): Uint8Array {
  return new TextEncoder().encode(loadEnv().JWT_SECRET);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    if (typeof payload.sub !== 'string') {
      throw new UnauthorizedError(ERR_AUTH_INVALID_JWT, 'Missing subject');
    }
    return { userId: payload.sub };
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError(ERR_AUTH_INVALID_JWT, 'Invalid session token');
  }
}
