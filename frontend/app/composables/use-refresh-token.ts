export const AUTH_REFRESH_TOKEN_KEY = "mealie.refresh_token";
export const AUTH_REFRESH_TOKEN_EXPIRY_KEY = "mealie.refresh_token_expires_at";

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function writeRefreshToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString();
  window.localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_REFRESH_TOKEN_EXPIRY_KEY, expiresAt);
}

export function readRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  const expiresAt = window.localStorage.getItem(AUTH_REFRESH_TOKEN_EXPIRY_KEY);

  if (!token || !expiresAt) {
    clearRefreshToken();
    return null;
  }

  if (new Date(expiresAt).getTime() <= Date.now()) {
    clearRefreshToken();
    return null;
  }

  return token;
}

export function clearRefreshToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_REFRESH_TOKEN_EXPIRY_KEY);
}

export function getRefreshTokenExpiryMs() {
  return REFRESH_TOKEN_TTL_MS;
}
