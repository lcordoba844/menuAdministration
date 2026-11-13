import { createContext, useContext } from 'react';

export type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarContextValue {
  showSnackbar: (
    type: SnackbarType,
    message: string,
    timeoutMs?: number,
  ) => void;
  setSnackbarContainer: (container: HTMLElement | null) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error('useSnackbar must be used within SnackbarProvider');
  return context;
}
