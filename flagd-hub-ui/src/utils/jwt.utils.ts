interface JwtPayload {
  exp: number;
  [key: string]: any;
}

/**
 * Safely decodes a JWT token payload
 * @param token - The JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - The JWT token string
 * @returns true if expired or invalid, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  return payload.exp * 1000 < Date.now();
}

/**
 * Validates JWT token format and expiration
 * @param token - The JWT token string
 * @returns true if valid and not expired
 */
export function isTokenValid(token: string): boolean {
  if (!token || token.split('.').length !== 3) {
    return false;
  }

  return !isTokenExpired(token);
}
