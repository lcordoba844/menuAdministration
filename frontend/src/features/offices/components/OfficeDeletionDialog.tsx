import type { ReactElement } from 'react';

import { ModalDialog } from '@/components/ModalDialog';
import type { Office } from '@/features/offices/office.types';

interface OfficeDeletionDialogProps {
  isOpen: boolean;
  office?: Office;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function OfficeDeletionDialog({
  isOpen,
  office,
  isDeleting,
  onConfirm,
  onClose,
}: OfficeDeletionDialogProps): ReactElement {
  return (
    <ModalDialog
      isOpen={isOpen}
      title={office ? `Delete ${office.name}?` : 'Delete office?'}
      isBusy={isDeleting}
      onClose={onClose}
    >
      <div>
        <p className="mt-3 text-base-content/70">
          This office will no longer be available for new diner profiles.
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
