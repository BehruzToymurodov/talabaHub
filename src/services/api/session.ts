import type { User } from "../../types";
import { readStorage, removeStorage, writeStorage } from "../storage/storage";

type StoredAuth = {
  token: string;
  user: User;
  createdAt: string;
};

const AUTH_STORAGE_KEY = "auth";

export function getStoredAuth(): StoredAuth | null {
  return readStorage<StoredAuth | null>(AUTH_STORAGE_KEY, null);
}

export function setStoredAuth(auth: StoredAuth) {
  writeStorage(AUTH_STORAGE_KEY, auth);
}

export function clearStoredAuth() {
  removeStorage(AUTH_STORAGE_KEY);
}

export function getAuthToken() {
  return getStoredAuth()?.token ?? null;
}

export function getAuthUser() {
  return getStoredAuth()?.user ?? null;
}

export function setAuthUser(user: User) {
  const current = getStoredAuth();
  if (!current) return;
  setStoredAuth({ ...current, user });
}
