import type { ReactElement } from 'react';

import { ModalDialog } from '@/components/ModalDialog';
import type { Department } from '@/features/departments/department.types';

interface DepartmentDeletionDialogProps {
  isOpen: boolean;
  department?: Department;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DepartmentDeletionDialog({
  isOpen,
  department,
  isDeleting,
  onConfirm,
  onClose,
}: DepartmentDeletionDialogProps): ReactElement {
  return (
    <ModalDialog
      isOpen={isOpen}
      title={department ? `Delete ${department.name}?` : 'Delete department?'}
      isBusy={isDeleting}
      onClose={onClose}
    >
      <div>
        <p className="mt-3 text-base-content/70">
          This department will no longer be available for new diner profiles.
        </p>
        <div className="modal-action">
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
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}
