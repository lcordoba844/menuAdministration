import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { SnackbarContext } from '@/components/snackbar-context';
import type { SnackbarType } from '@/components/snackbar-context';

const DEFAULT_TIMEOUT_MS = 8_000;

const alertClasses: Record<SnackbarType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
};

interface SnackbarMessage {
  message: string;
  type: SnackbarType;
  timeoutMs: number;
  expiresAt: number;
}

export function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [container, setSnackbarContainer] = useState<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const snackbarRef = useRef<HTMLDivElement>(null);

  const showSnackbar = useCallback(
    (
      type: SnackbarType,
      message: string,
      timeoutMs: number = DEFAULT_TIMEOUT_MS,
    ): void => {
      setIsDismissing(false);
      setSnackbar({
        message,
        type,
        timeoutMs,
        expiresAt: Date.now() + timeoutMs,
      });
    },
    [],
  );

  useEffect(() => {
    if (!snackbar || isHovered || snackbarRef.current?.matches(':hover'))
      return;
    const remaining = Math.max(0, snackbar.expiresAt - Date.now());
    const timer = setTimeout(() => setIsDismissing(true), remaining);
    const progress = progressRef.current;
    const progressAnimation = progress?.animate(
      [
        {
          transform: `scaleX(${snackbar.timeoutMs > 0 ? remaining / snackbar.timeoutMs : 0})`,
        },
        { transform: 'scaleX(0)' },
      ],
      { duration: remaining, fill: 'forwards' },
    );

    return (): void => {
      clearTimeout(timer);
      if (progress)
        progress.style.transform = getComputedStyle(progress).transform;
      progressAnimation?.cancel();
    };
  }, [snackbar, container, isHovered]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, setSnackbarContainer }}>
      {children}
      {snackbar &&
        createPortal(
          <div className="toast toast-end toast-bottom z-50 max-w-full p-4">
            <div
              ref={snackbarRef}
              className={`group alert relative overflow-hidden shadow-lg ${alertClasses[snackbar.type]} ${isDismissing ? 'snackbar-dismissing' : ''}`}
              role={snackbar.type === 'error' ? 'alert' : 'status'}
              onMouseEnter={() => {
                setIsHovered(true);
                setIsDismissing(false);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
                setSnackbar((current) =>
                  current === snackbar
                    ? { ...current, expiresAt: Date.now() + current.timeoutMs }
                    : current,
                );
              }}
              onAnimationEnd={(event) => {
                if (
                  event.target === event.currentTarget &&
                  event.animationName === 'snackbar-fade-out' &&
                  isDismissing
                ) {
                  setSnackbar((current) =>
                    current === snackbar ? null : current,
                  );
                  setIsHovered(false);
                }
              }}
            >
              <span className="wrap-break-word">{snackbar.message}</span>
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm border-transparent text-inherit hover:bg-current/10 active:bg-current/20"
                aria-label="Dismiss notification"
                onClick={() => setIsDismissing(true)}
                disabled={isDismissing}
              >
                <X size={18} aria-hidden="true" />
              </button>
              <div
                className="absolute inset-x-0 bottom-0 h-1 bg-current/15 transition-opacity duration-150 group-hover:opacity-0"
                aria-hidden="true"
              >
                <div
                  ref={progressRef}
                  className="h-full origin-left bg-current opacity-60"
                />
              </div>
            </div>
          </div>,
          container ?? document.body,
        )}
    </SnackbarContext.Provider>
  );
}
