import axios from 'axios';
import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '@/auth/auth-context';
import { useSnackbar } from '@/components/snackbar-context';

export function LoginPage(): ReactElement {
  const { status, login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  if (status === 'authenticated') return <Navigate to="/" replace />;

  async function onSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showSnackbar(
          'error',
          error.response?.status === 401
            ? 'Invalid credentials.'
            : error.response?.status === 400
              ? 'Enter a valid email address and password.'
              : 'Unable to sign in. Please try again.',
        );
      } else {
        showSnackbar(
          'error',
          error instanceof Error
            ? error.message
            : 'Unable to sign in. Please try again.',
        );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16 sm:py-24">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body gap-6">
          <div>
            <h1 className="text-3xl font-bold">Sign in</h1>
          </div>
          <form
            onSubmit={(event) => {
              void onSubmit(event);
            }}
            className="flex flex-col gap-4"
            aria-busy={pending}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="input w-full"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={pending}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input w-full"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={pending}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={pending}
            >
              {pending && (
                <span
                  className="loading loading-spinner loading-sm"
                  aria-hidden="true"
                />
              )}
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
