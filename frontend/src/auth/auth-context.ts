import type { AxiosInstance } from 'axios';
import { createContext, useContext } from 'react';

import type { Session } from '@/auth/session';

export interface AuthContextValue {
  status: 'authenticated' | 'unauthenticated';
  user: Session['user'] | null;
  api: AxiosInstance;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
