import { Check } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';

import { ModalDialog } from '@/components/ModalDialog';
import type {
  Office,
  SaveOfficeRequest,
} from '@/features/offices/office.types';

interface OfficeEditorDialogProps {
  isOpen: boolean;
  office?: Office;
  isSaving: boolean;
  onSave: (input: SaveOfficeRequest) => Promise<void>;
  onClose: () => void;
}

const fields = [
  {
    name: 'name',
    label: 'Office name',
    maxLength: 100,
  },
  {
    name: 'city',
    label: 'City',
    maxLength: 100,
  },
  {
    name: 'country',
    label: 'Country',
    maxLength: 100,
  },
  {
    name: 'address',
    label: 'Street address',
    maxLength: 255,
  },
] as const;

export function OfficeEditorDialog({
  isOpen,
  office,
  isSaving,
  onSave,
  onClose,
}: OfficeEditorDialogProps): ReactElement {
  const [values, setValues] = useState<SaveOfficeRequest>(
    office ?? { name: '', city: '', country: '', address: '' },
  );
  const [validationError, setValidationError] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isSaving) return;
    const input = {
      name: values.name.trim(),
      city: values.city.trim(),
      country: values.country.trim(),
      address: values.address.trim(),
    };
    if (Object.values(input).some((value) => value.length === 0)) {
      setValidationError(
        'Complete every field with a value other than spaces.',
      );
      return;
    }
    setValidationError('');
    void onSave(input);
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      title={office ? 'Edit office' : 'Create office'}
      isBusy={isSaving}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} aria-busy={isSaving}>
        <p className="mb-4 text-sm text-base-content/60">
          All fields are required.
        </p>
        <fieldset disabled={isSaving} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`flex flex-col gap-2 ${field.name === 'address' ? 'sm:col-span-2' : ''}`}
            >
              <label
                htmlFor={`office-${field.name}`}
                className="text-sm font-medium"
              >
                {field.label}
              </label>
              <input
                id={`office-${field.name}`}
                name={field.name}
                type="text"
                className="input w-full"
                required
                maxLength={field.maxLength}
                autoFocus={field.name === 'name'}
                value={values[field.name]}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [field.name]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
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
