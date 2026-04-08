/**
 * Wraps expo-auth-session's Google provider to expose a hook
 * that returns an ID token to be exchanged with our backend.
 */
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_OAUTH_CLIENT_ID } from '../config/env';

WebBrowser.maybeCompleteAuthSession();

export interface GoogleSignInHookResult {
  isReady: boolean;
  promptAsync: () => Promise<string | null>;
}

/**
 * Returns a promptAsync() that resolves with a Google ID token
 * (the same one we POST to /auth/google) or null on cancel.
 */
export function useGoogleSignIn(): GoogleSignInHookResult {
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_OAUTH_CLIENT_ID,
  });

  return {
    isReady: request !== null,
    promptAsync: async () => {
      const result = await promptAsync();
      if (result.type !== 'success') return null;
      return result.params.id_token ?? null;
    },
  };
}
