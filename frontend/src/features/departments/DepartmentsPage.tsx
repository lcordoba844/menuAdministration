import { Network, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { useSnackbar } from '@/components/snackbar-context';
import { DepartmentDeletionDialog } from '@/features/departments/components/DepartmentDeletionDialog';
import { DepartmentEditorDialog } from '@/features/departments/components/DepartmentEditorDialog';
import { DepartmentList } from '@/features/departments/components/DepartmentList';
import type {
  Department,
  SaveDepartmentRequest,
} from '@/features/departments/department.types';
import { useDepartmentsViewModel } from '@/features/departments/useDepartmentsViewModel';

type PageAction =
  | { action: 'create' }
  | { action: 'edit'; department: Department }
  | { action: 'delete'; department: Department }
  | null;

export function DepartmentsPage(): ReactElement {
  const { showSnackbar } = useSnackbar();
  const viewModel = useDepartmentsViewModel();
  const [pageAction, setPageAction] = useState<PageAction>(null);
  const hasLoadError = viewModel.loadError !== null;

  useEffect(() => {
    if (viewModel.loadError) showSnackbar('error', viewModel.loadError.message);
  }, [viewModel.loadError, showSnackbar]);

  async function save(input: SaveDepartmentRequest): Promise<void> {
    if (!pageAction || pageAction.action === 'delete' || viewModel.isLoading)
      return;
    try {
      if (pageAction.action === 'create') {
        await viewModel.createDepartment(input);
        showSnackbar('success', 'Department created.');
      } else if (pageAction.action === 'edit') {
        await viewModel.updateDepartment(pageAction.department.id, input);
        showSnackbar('success', 'Department updated.');
      }
      setPageAction(null);
    } catch (error) {
      showSnackbar(
        'error',
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      );
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!pageAction || pageAction.action !== 'delete' || viewModel.isLoading)
      return;
    try {
      await viewModel.deleteDepartment(pageAction.department.id);
      showSnackbar('success', 'Department deleted.');
      setPageAction(null);
    } catch (error) {
      showSnackbar(
        'error',
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      );
    }
  }

  return (
    <section
      className="space-y-6 text-left"
      aria-labelledby="departments-title"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Network size={18} aria-hidden="true" />
            Administration
          </div>
          <h1 id="departments-title" className="text-3xl font-bold sm:text-4xl">
            Departments
          </h1>
          <p className="mt-3 text-base-content/65">
            Manage the departments your diners belong to.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setPageAction({ action: 'create' })}
          disabled={viewModel.isLoading || pageAction !== null}
        >
          <Plus size={18} aria-hidden="true" />
          Create department
        </button>
      </header>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          Department directory
          {(!viewModel.isLoading || pageAction !== null) &&
            viewModel.departments.length > 0 && (
              <span className="badge badge-neutral badge-sm">
                {viewModel.departments.length}
              </span>
            )}
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={viewModel.refresh}
          disabled={viewModel.isLoading || pageAction !== null}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>
      {viewModel.isLoading && pageAction === null && (
        <div
          role="status"
          className="flex items-center justify-center gap-3 rounded-box border border-base-300 bg-base-100 py-16 text-base-content/60"
        >
          <span
            className="loading loading-spinner loading-sm"
            aria-hidden="true"
          />
          Loading departments…
        </div>
      )}
      {!viewModel.isLoading && hasLoadError && pageAction === null && (
        <div
          role="alert"
          className="rounded-box border border-error/30 bg-base-100 p-6"
        >
          <p className="text-error">
            Unable to load departments. Please try again.
          </p>
          <button
            type="button"
            className="btn btn-outline btn-sm mt-4"
            onClick={viewModel.refresh}
          >
            Try again
          </button>
        </div>
      )}
      {(!viewModel.isLoading || pageAction !== null) &&
        (viewModel.departments.length > 0 ||
          !hasLoadError ||
          pageAction !== null) && (
          <DepartmentList
            departments={viewModel.departments}
            disabled={viewModel.isLoading || pageAction !== null}
            onCreate={() => setPageAction({ action: 'create' })}
            onEdit={(department) =>
              setPageAction({ action: 'edit', department })
            }
            onDelete={(department) =>
              setPageAction({ action: 'delete', department })
            }
          />
        )}
      <DepartmentEditorDialog
        key={
          pageAction?.action === 'edit'
            ? pageAction.department.id
            : (pageAction?.action ?? 'closed')
        }
        isOpen={
          pageAction?.action === 'create' || pageAction?.action === 'edit'
        }
        department={
          pageAction?.action === 'edit' ? pageAction.department : undefined
        }
        isSaving={viewModel.isLoading}
        onSave={save}
        onClose={() => setPageAction(null)}
      />
      <DepartmentDeletionDialog
        isOpen={pageAction?.action === 'delete'}
        department={
          pageAction?.action === 'delete' ? pageAction.department : undefined
        }
        isDeleting={viewModel.isLoading}
        onConfirm={() => {
          void confirmDelete();
        }}
        onClose={() => setPageAction(null)}
      />
    </section>
  );
}
