import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { ReactElement, ReactNode } from 'react';

import { configureAuth, createApiClient, publicApi } from '@/api/client';
import { AuthContext } from '@/auth/auth-context';
import {
  clearSession,
  readSession,
  saveSession,
  SESSION_STORAGE_KEY,
} from '@/auth/session';
import type { Session } from '@/auth/session';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [session, setSession] = useState(readSession);
  const sessionRef = useRef(session);
  const revisionRef = useRef(0);

  const updateSession = useCallback((next: Session | null) => {
    if (next?.jwt === sessionRef.current?.jwt) return;
    sessionRef.current = next;
    revisionRef.current += 1;
    setSession(next);
  }, []);

  const syncSession = useCallback(() => {
    const next = readSession();
    updateSession(next);
    return next;
  }, [updateSession]);

  const logout = useCallback((): void => {
    clearSession();
    revisionRef.current += 1;
    updateSession(null);
  }, [updateSession]);

  const handleUnauthorized = useCallback(
    (jwt: string): void => {
      if (syncSession()?.jwt === jwt) {
        logout();
      }
    },
    [syncSession, logout],
  );

  // Each provider owns its API client and session callbacks.
  const [api] = useState(createApiClient);

  useLayoutEffect(
    () => configureAuth(api, syncSession, handleUnauthorized),
    [api, syncSession, handleUnauthorized],
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (
        event.storageArea === localStorage &&
        (event.key === SESSION_STORAGE_KEY || event.key === null)
      ) {
        syncSession();
      }
    };
    const onVisible = (): void => {
      if (document.visibilityState === 'visible') syncSession();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', syncSession);
    document.addEventListener('visibilitychange', onVisible);
    return (): void => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', syncSession);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [syncSession]);

  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    const timer = setTimeout(syncSession, remaining);
    return (): void => clearTimeout(timer);
  }, [session, syncSession]);

  async function login(email: string, password: string): Promise<void> {
    syncSession();
    const revision = revisionRef.current;
    const { data } = await publicApi.post<{ jwt: string }>('/auth/login', {
      email,
      password,
    });
    syncSession();
    if (revisionRef.current !== revision) {
      throw new Error('Your session changed. Please try again.');
    }
    updateSession(saveSession(data.jwt));
  }

  return (
    <AuthContext.Provider
      value={{
        status: session ? 'authenticated' : 'unauthenticated',
        user: session?.user ?? null,
        api,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
