import { v4 as uuidv4 } from "uuid";

const AUTH_KEY = "valentine-auth-token";

export function generateAuthToken(): string {
  const token = uuidv4();
  localStorage.setItem(AUTH_KEY, token);
  return token;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem(AUTH_KEY);
  return token !== null && token.length > 0;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
