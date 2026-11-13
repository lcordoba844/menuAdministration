import { Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

import { useSnackbar } from '@/components/snackbar-context';
import type { Office } from '@/features/offices/office.types';

interface DeleteOfficeDialogProps {
  office: Office;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteOfficeDialog({
  office,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteOfficeDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { setSnackbarContainer } = useSnackbar();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    setSnackbarContainer(dialog);
    return (): void => {
      setSnackbarContainer(null);
      dialog?.close();
    };
  }, [setSnackbarContainer]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="delete-office-title"
      aria-describedby="delete-office-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!isDeleting) onCancel();
      }}
    >
      <div className="modal-box text-left">
        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-error/10 text-error">
          <Trash2 size={21} aria-hidden="true" />
        </div>
        <h2 id="delete-office-title" className="text-xl font-semibold">
          Delete {office.name}?
        </h2>
        <p id="delete-office-description" className="mt-3 text-base-content/70">
          This office will no longer be available for new diner profiles.
        </p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            autoFocus
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && (
              <span
                className="loading loading-spinner loading-sm"
                aria-hidden="true"
              />
            )}
            {isDeleting ? 'Deleting…' : 'Delete office'}
          </button>
        </div>
      </div>
    </dialog>
  );
}
