import { jwtDecode } from 'jwt-decode';

export interface Session {
  jwt: string;
  user: { id: string; role: 'USER' | 'ADMIN' };
  expiresAt: number;
}

interface AuthPayload {
  userId: string;
  role: Session['user']['role'];
  exp: number;
}

export const SESSION_STORAGE_KEY = 'menu-administration.jwt';

export function decodeSession(jwt: string | null): Session | null {
  if (!jwt) return null;

  try {
    const { userId, role, exp } = jwtDecode<AuthPayload>(jwt);
    if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) return null;

    return { jwt, user: { id: userId, role }, expiresAt: exp * 1000 };
  } catch {
    return null;
  }
}

export function readSession(): Session | null {
  try {
    const jwt = localStorage.getItem(SESSION_STORAGE_KEY);
    const session = decodeSession(jwt);
    if (jwt && !session) localStorage.removeItem(SESSION_STORAGE_KEY);
    return session;
  } catch {
    return null;
  }
}

export function saveSession(jwt: string): Session {
  const next = decodeSession(jwt);
  if (!next)
    throw new Error(
      'The server returned an invalid session. Please try again.',
    );
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, jwt);
  } catch {
    throw new Error('Allow browser storage to sign in and keep your session.');
  }
  return next;
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Still clear in-memory authentication if browser storage becomes unavailable.
  }
}
