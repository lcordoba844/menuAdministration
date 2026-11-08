import axios from 'axios';
import type { AxiosInstance } from 'axios';

import type { Session } from '@/auth/session';
import { environment } from '@/config/environment';

const config = {
  baseURL: environment.apiBaseUrl,
  timeout: 15000,
};

// Login uses a separate client so failed credentials cannot end an existing session.
export const publicApi = axios.create(config);

export function createApiClient(): AxiosInstance {
  return axios.create(config);
}

export function configureAuth(
  api: AxiosInstance,
  getSession: () => Session | null,
  onUnauthorized: (jwt: string) => void,
): () => void {
  const requestInterceptor = api.interceptors.request.use((request) => {
    const session = getSession();
    if (session) request.headers.set('Authorization', `Bearer ${session.jwt}`);
    else request.headers.delete('Authorization');
    return request;
  });

  const responseInterceptor = api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const authorization = error.config?.headers.get('Authorization');
        if (
          typeof authorization === 'string' &&
          authorization.startsWith('Bearer ')
        ) {
          onUnauthorized(authorization.slice(7));
        }
      }
      throw error;
    },
  );

  return (): void => {
    api.interceptors.request.eject(requestInterceptor);
    api.interceptors.response.eject(responseInterceptor);
  };
}
