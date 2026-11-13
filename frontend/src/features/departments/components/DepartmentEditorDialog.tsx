import { Check } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';

import { ModalDialog } from '@/components/ModalDialog';
import type {
  Department,
  SaveDepartmentRequest,
} from '@/features/departments/department.types';

interface DepartmentEditorDialogProps {
  isOpen: boolean;
  department?: Department;
  isSaving: boolean;
  onSave: (input: SaveDepartmentRequest) => Promise<void>;
  onClose: () => void;
}

export function DepartmentEditorDialog({
  isOpen,
  department,
  isSaving,
  onSave,
  onClose,
}: DepartmentEditorDialogProps): ReactElement {
  const [values, setValues] = useState<SaveDepartmentRequest>(
    department ?? { name: '', description: '' },
  );
  const [validationError, setValidationError] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isSaving) return;
    const input = {
      name: values.name.trim(),
      description: values.description.trim(),
    };
    if (input.name.length === 0) {
      setValidationError('Enter a department name other than spaces.');
      return;
    }
    setValidationError('');
    void onSave(input);
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      title={department ? 'Edit department' : 'Create department'}
      isBusy={isSaving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} aria-busy={isSaving}>
        <p className="mb-4 text-sm text-base-content/60">
          Name is required. Description is optional.
        </p>
        <fieldset disabled={isSaving} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="department-name" className="text-sm font-medium">
              Department name
            </label>
            <input
              id="department-name"
              name="name"
              type="text"
              className="input w-full"
              required
              maxLength={100}
              autoFocus
              value={values.name}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="department-description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="department-description"
              name="description"
              className="textarea w-full"
              maxLength={255}
              rows={3}
              value={values.description}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
            />
          </div>
        </fieldset>
        {validationError && (
          <p role="alert" className="mt-4 text-sm text-error">
            {validationError}
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? (
              <span
                className="loading loading-spinner loading-sm"
                aria-hidden="true"
              />
            ) : (
              <Check size={18} aria-hidden="true" />
            )}
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </ModalDialog>
  );
}
