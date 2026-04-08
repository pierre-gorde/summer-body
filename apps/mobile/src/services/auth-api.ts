/**
 * API calls for authentication and the current user.
 */
import { apiRequest } from './api-client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface GoogleSignInResponse {
  token: string;
  user: AuthenticatedUser;
}

const PATH_AUTH_GOOGLE = '/auth/google';
const PATH_ME = '/me';

export function exchangeGoogleIdToken(idToken: string): Promise<GoogleSignInResponse> {
  return apiRequest<GoogleSignInResponse>(PATH_AUTH_GOOGLE, {
    method: 'POST',
    body: { idToken },
  });
}

export function fetchMe(token: string): Promise<AuthenticatedUser> {
  return apiRequest<AuthenticatedUser>(PATH_ME, { token });
}
