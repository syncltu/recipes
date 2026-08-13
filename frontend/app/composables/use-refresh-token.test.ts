import { beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_REFRESH_TOKEN_EXPIRY_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  clearRefreshToken,
  getRefreshTokenExpiryMs,
  readRefreshToken,
  writeRefreshToken,
} from "./use-refresh-token";

describe("refresh token persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores a 30-day refresh token and reads it back while it is still valid", () => {
    const token = "stored-refresh-token";

    writeRefreshToken(token);

    expect(window.localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)).toBe(token);
    expect(readRefreshToken()).toBe(token);
    expect(getRefreshTokenExpiryMs()).toBe(30 * 24 * 60 * 60 * 1000);
    expect(window.localStorage.getItem(AUTH_REFRESH_TOKEN_EXPIRY_KEY)).not.toBeNull();
  });

  it("clears the saved refresh token once it expires", () => {
    const token = "expired-refresh-token";
    const expiredAt = new Date(Date.now() - 60000).toISOString();

    window.localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_REFRESH_TOKEN_EXPIRY_KEY, expiredAt);

    expect(readRefreshToken()).toBeNull();
    expect(window.localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)).toBeNull();
    expect(window.localStorage.getItem(AUTH_REFRESH_TOKEN_EXPIRY_KEY)).toBeNull();

    clearRefreshToken();
    expect(window.localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)).toBeNull();
  });
});
