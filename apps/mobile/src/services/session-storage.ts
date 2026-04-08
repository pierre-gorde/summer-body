/**
 * Persists the session JWT in expo-secure-store (Keychain on iOS).
 */
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEY_SESSION_TOKEN } from '../constants/storage';

export async function loadSessionToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_STORE_KEY_SESSION_TOKEN);
}

export async function saveSessionToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEY_SESSION_TOKEN, token);
}

export async function clearSessionToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_STORE_KEY_SESSION_TOKEN);
}
