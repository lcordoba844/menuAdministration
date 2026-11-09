import { Check, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement, SubmitEvent } from 'react';

import type { DepartmentInput } from '@/features/departments/departments-types';

interface DepartmentFormProps {
  initialValue?: DepartmentInput;
  loading: boolean;
  error: string;
  onSave: (input: DepartmentInput) => Promise<void>;
  onCancel: () => void;
}

export function DepartmentForm({
  initialValue,
  loading,
  error,
  onSave,
  onCancel,
}: DepartmentFormProps): ReactElement {
  const [values, setValues] = useState<DepartmentInput>(
    initialValue ?? { name: '', description: '' },
  );
  const [validationError, setValidationError] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (loading) return;
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
    <section
      className="card border border-primary/20 bg-base-100 shadow-sm"
      aria-labelledby="department-form-title"
    >
      <div className="card-body gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="department-form-title" className="text-xl font-semibold">
              {initialValue ? 'Edit department' : 'Create a department'}
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              Name is required. Description is optional.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            aria-label="Close department form"
            onClick={onCancel}
            disabled={loading}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleSubmit} aria-busy={loading}>
          <fieldset disabled={loading} className="grid gap-4">
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
          {(validationError || error) && (
            <p role="alert" className="mt-4 text-sm text-error">
              {validationError || error}
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="loading loading-spinner loading-sm"
                  aria-hidden="true"
                />
              ) : (
                <Check size={18} aria-hidden="true" />
              )}
              {loading
                ? 'Saving…'
                : initialValue
                  ? 'Save changes'
                  : 'Create department'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
