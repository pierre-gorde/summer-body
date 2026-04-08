/**
 * Reads runtime config from app.json `extra` block via expo-constants.
 * No inline magic strings.
 */
import Constants from 'expo-constants';

interface AppConfig {
  apiBaseUrl: string;
  googleOAuthClientId: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<AppConfig>;

if (!extra.apiBaseUrl) {
  throw new Error('apiBaseUrl is missing from app.json extra');
}

export const API_BASE_URL: string = extra.apiBaseUrl;
export const GOOGLE_OAUTH_CLIENT_ID: string = extra.googleOAuthClientId ?? '';
