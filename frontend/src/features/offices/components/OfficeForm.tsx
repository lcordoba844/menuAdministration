import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';

import type { SaveOfficeRequest } from '@/features/offices/office.types';

interface OfficeFormProps {
  initialValue?: SaveOfficeRequest;
  isSaving: boolean;
  onSave: (input: SaveOfficeRequest) => Promise<void>;
  onCancel: () => void;
}

const fields = [
  {
    name: 'name',
    label: 'Office name',
    maxLength: 100,
    autoComplete: 'organization',
  },
  {
    name: 'city',
    label: 'City',
    maxLength: 100,
    autoComplete: 'address-level2',
  },
  {
    name: 'country',
    label: 'Country',
    maxLength: 100,
    autoComplete: 'country-name',
  },
  {
    name: 'address',
    label: 'Street address',
    maxLength: 255,
    autoComplete: 'street-address',
  },
] as const;

export function OfficeForm({
  initialValue,
  isSaving,
  onSave,
  onCancel,
}: OfficeFormProps): ReactElement {
  const [values, setValues] = useState<SaveOfficeRequest>(
    initialValue ?? { name: '', city: '', country: '', address: '' },
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
    <section
      className="card border border-primary/20 bg-base-100 shadow-sm"
      aria-labelledby="office-form-title"
    >
      <div className="card-body gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="office-form-title" className="text-xl font-semibold">
              {initialValue ? 'Edit office' : 'Create an office'}
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              All fields are required.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Close office form"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleSubmit} aria-busy={isSaving}>
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
                  autoComplete={field.autoComplete}
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
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <span
                  className="loading loading-spinner loading-sm"
                  aria-hidden="true"
                />
              ) : (
                <Check size={18} aria-hidden="true" />
              )}
              {isSaving
                ? 'Saving…'
                : initialValue
                  ? 'Save changes'
                  : 'Create office'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
