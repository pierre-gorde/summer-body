/**
 * Session state — token + current user.
 * Single source of truth used by the navigator and screens.
 */
import { create } from 'zustand';
import type { AuthenticatedUser } from '../services/auth-api';
import { exchangeGoogleIdToken, fetchMe } from '../services/auth-api';
import { clearSessionToken, loadSessionToken, saveSessionToken } from '../services/session-storage';

interface SessionState {
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  token: string | null;
  user: AuthenticatedUser | null;
  hydrate: () => Promise<void>;
  signInWithGoogleIdToken: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'idle',
  token: null,
  user: null,

  async hydrate() {
    set({ status: 'loading' });
    const token = await loadSessionToken();
    if (!token) {
      set({ status: 'unauthenticated', token: null, user: null });
      return;
    }
    try {
      const user = await fetchMe(token);
      set({ status: 'authenticated', token, user });
    } catch {
      await clearSessionToken();
      set({ status: 'unauthenticated', token: null, user: null });
    }
  },

  async signInWithGoogleIdToken(idToken: string) {
    set({ status: 'loading' });
    const { token, user } = await exchangeGoogleIdToken(idToken);
    await saveSessionToken(token);
    set({ status: 'authenticated', token, user });
  },

  async signOut() {
    await clearSessionToken();
    set({ status: 'unauthenticated', token: null, user: null });
  },
}));
