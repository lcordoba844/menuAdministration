import { Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';

import type { Department } from '@/features/departments/departments-types';

interface DeleteDepartmentDialogProps {
  department: Department;
  loading: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDepartmentDialog({
  department,
  loading,
  error,
  onConfirm,
  onCancel,
}: DeleteDepartmentDialogProps): ReactElement {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return (): void => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="delete-department-title"
      aria-describedby="delete-department-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!loading) onCancel();
      }}
    >
      <div className="modal-box text-left">
        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-error/10 text-error">
          <Trash2 size={21} aria-hidden="true" />
        </div>
        <h2 id="delete-department-title" className="text-xl font-semibold">
          Delete {department.name}?
        </h2>
        <p
          id="delete-department-description"
          className="mt-3 text-base-content/70"
        >
          This department will no longer be available for new diner profiles.
        </p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-error">
            {error}
          </p>
        )}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            autoFocus
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <span
                className="loading loading-spinner loading-sm"
                aria-hidden="true"
              />
            )}
            {loading ? 'Deleting…' : 'Delete department'}
          </button>
        </div>
      </div>
    </dialog>
  );
}
