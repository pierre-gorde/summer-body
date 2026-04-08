import { OAuth2Client } from 'google-auth-library';
import { ERR_AUTH_INVALID_GOOGLE_TOKEN } from '../constants/errors.js';
import { loadEnv } from '../env.js';
import { UnauthorizedError } from '../errors/app-error.js';

export interface GoogleIdentity {
  sub: string;
  email: string;
  name: string;
  picture: string | undefined;
}

let cachedClient: OAuth2Client | undefined;

function getClient(): OAuth2Client {
  if (cachedClient) return cachedClient;
  const env = loadEnv();
  cachedClient = new OAuth2Client(env.GOOGLE_OAUTH_CLIENT_ID);
  return cachedClient;
}

/**
 * Verifies a Google ID token and extracts the identity claims we care about.
 * Throws UnauthorizedError on any verification failure.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
  const env = loadEnv();
  try {
    const ticket = await getClient().verifyIdToken({
      idToken,
      audience: env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.name) {
      throw new UnauthorizedError(ERR_AUTH_INVALID_GOOGLE_TOKEN, 'Incomplete Google identity');
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError(ERR_AUTH_INVALID_GOOGLE_TOKEN, 'Invalid Google ID token');
  }
}
