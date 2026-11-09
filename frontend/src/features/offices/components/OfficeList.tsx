import { Building2, Pencil, Plus, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';

import type { Office } from '@/features/offices/offices-types';

interface OfficeListProps {
  offices: Office[];
  disabled: boolean;
  onCreate: () => void;
  onEdit: (office: Office) => void;
  onDelete: (office: Office) => void;
}

export function OfficeList({
  offices,
  disabled,
  onCreate,
  onEdit,
  onDelete,
}: OfficeListProps): ReactElement {
  if (offices.length === 0) {
    return (
      <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
        <Building2
          size={32}
          className="mx-auto text-base-content/40"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-lg font-semibold">No offices yet</h2>
        <p className="mt-2 text-sm text-base-content/60">
          Add your first office to start organizing diner profiles.
        </p>
        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={onCreate}
          disabled={disabled}
        >
          <Plus size={18} aria-hidden="true" />
          Create office
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
      <table className="table">
        <caption className="sr-only">
          Active offices and their locations
        </caption>
        <thead>
          <tr>
            <th scope="col">Office</th>
            <th scope="col" className="hidden md:table-cell">
              Location
            </th>
            <th scope="col" className="text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {offices.map((office) => (
            <tr key={office.id}>
              <td className="py-5">
                <p className="font-semibold">{office.name}</p>
                <p className="mt-1 wrap-break-words text-sm text-base-content/60">
                  {office.address}
                </p>
                <p className="mt-1 text-sm text-base-content/60 md:hidden">
                  {office.city}, {office.country}
                </p>
              </td>
              <td className="hidden md:table-cell">
                <p>{office.city}</p>
                <p className="mt-1 text-sm text-base-content/60">
                  {office.country}
                </p>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={`Edit ${office.name}`}
                    onClick={() => onEdit(office)}
                    disabled={disabled}
                  >
                    <Pencil size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    aria-label={`Delete ${office.name}`}
                    onClick={() => onDelete(office)}
                    disabled={disabled}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
