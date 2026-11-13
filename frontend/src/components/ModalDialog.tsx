import { X } from 'lucide-react';
import { useId, useLayoutEffect, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { useSnackbar } from '@/components/snackbar-context';

interface ModalDialogProps {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  isBusy: boolean;
  onClose: () => void;
}

export function ModalDialog({
  children,
  title,
  isOpen,
  isBusy,
  onClose,
}: ModalDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { setSnackbarContainer } = useSnackbar();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    dialog.showModal();
    // Keep notifications visible and interactive inside the active modal.
    setSnackbarContainer(dialog);
    return (): void => {
      setSnackbarContainer(null);
      dialog.close();
    };
  }, [isOpen, setSnackbarContainer]);

  function close(): void {
    if (!isBusy) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {isOpen && (
        <div className="modal-box space-y-5 text-left">
          <header className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
            <button
              type="button"
              className="btn btn-ghost btn-square btn-sm"
              aria-label="Close dialog"
              onClick={close}
              disabled={isBusy}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}
