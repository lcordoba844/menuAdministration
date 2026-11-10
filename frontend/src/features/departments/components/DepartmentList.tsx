import { Network, Pencil, Plus, Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';

import type { Department } from '@/features/departments/department.types';

interface DepartmentListProps {
  departments: Department[];
  disabled: boolean;
  onCreate: () => void;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export function DepartmentList({
  departments,
  disabled,
  onCreate,
  onEdit,
  onDelete,
}: DepartmentListProps): ReactElement {
  if (departments.length === 0) {
    return (
      <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
        <Network
          size={32}
          className="mx-auto text-base-content/40"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-lg font-semibold">No departments yet</h2>
        <p className="mt-2 text-sm text-base-content/60">
          Add your first department to start organizing diner profiles.
        </p>
        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={onCreate}
          disabled={disabled}
        >
          <Plus size={18} aria-hidden="true" />
          Create department
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
      <table className="table">
        <caption className="sr-only">
          Departments and their descriptions
        </caption>
        <thead>
          <tr>
            <th scope="col">Department</th>
            <th scope="col" className="text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td className="py-5">
                <p className="font-semibold">{department.name}</p>
                <p className="mt-1 wrap-break-words text-sm text-base-content/60">
                  {department.description}
                </p>
              </td>
              <td>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label={`Edit ${department.name}`}
                    onClick={() => onEdit(department)}
                    disabled={disabled}
                  >
                    <Pencil size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    aria-label={`Delete ${department.name}`}
                    onClick={() => onDelete(department)}
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
