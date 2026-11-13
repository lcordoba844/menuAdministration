import { Network, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';

import { useAuth } from '@/auth/auth-context';
import { useSnackbar } from '@/components/snackbar-context';
import { DepartmentDeletionDialog } from '@/features/departments/components/DepartmentDeletionDialog';
import { DepartmentEditorDialog } from '@/features/departments/components/DepartmentEditorDialog';
import { DepartmentList } from '@/features/departments/components/DepartmentList';
import { DepartmentApi } from '@/features/departments/department.api';
import type {
  Department,
  SaveDepartmentRequest,
} from '@/features/departments/department.types';

type PageAction =
  | { action: 'create' }
  | { action: 'edit'; department: Department }
  | { action: 'delete'; department: Department }
  | null;

export function DepartmentsPage(): ReactElement {
  const { api } = useAuth();
  const { showSnackbar } = useSnackbar();
  const departmentApi = useMemo(() => new DepartmentApi(api), [api]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageAction, setPageAction] = useState<PageAction>(null);
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadDepartments = useCallback((): Promise<void> => {
    return departmentApi
      .getAll()
      .then(setDepartments)
      .catch((error: unknown) => {
        setHasLoadError(true);
        showSnackbar(
          'error',
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
        );
      })
      .finally(() => setIsLoading(false));
  }, [departmentApi, showSnackbar]);

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);

  function refresh(): void {
    setHasLoadError(false);
    setIsLoading(true);
    void loadDepartments();
  }

  async function save(input: SaveDepartmentRequest): Promise<void> {
    if (!pageAction || pageAction.action === 'delete' || isLoading) return;
    setIsLoading(true);
    try {
      if (pageAction.action === 'create') {
        const created = await departmentApi.create(input);
        setDepartments((previous) => [created, ...previous]);
        showSnackbar('success', 'Department created.');
      } else if (pageAction.action === 'edit') {
        const updated = await departmentApi.update(
          pageAction.department.id,
          input,
        );
        setDepartments((previous) =>
          previous.map((department) =>
            department.id === updated.id ? updated : department,
          ),
        );
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
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!pageAction || pageAction.action !== 'delete' || isLoading) return;
    setIsLoading(true);
    try {
      await departmentApi.delete(pageAction.department.id);
      setDepartments((previous) =>
        previous.filter(
          (department) => department.id !== pageAction.department.id,
        ),
      );
      showSnackbar('success', 'Department deleted.');
      setPageAction(null);
    } catch (error) {
      showSnackbar(
        'error',
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      );
    } finally {
      setIsLoading(false);
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
          disabled={isLoading || pageAction !== null}
        >
          <Plus size={18} aria-hidden="true" />
          Create department
        </button>
      </header>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          Department directory
          {(!isLoading || pageAction !== null) && departments.length > 0 && (
            <span className="badge badge-neutral badge-sm">
              {departments.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={refresh}
          disabled={isLoading || pageAction !== null}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>
      {isLoading && pageAction === null && (
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
      {!isLoading && hasLoadError && pageAction === null && (
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
            onClick={refresh}
          >
            Try again
          </button>
        </div>
      )}
      {(!isLoading || pageAction !== null) &&
        (departments.length > 0 || !hasLoadError || pageAction !== null) && (
          <DepartmentList
            departments={departments}
            disabled={isLoading || pageAction !== null}
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
        isSaving={isLoading}
        onSave={save}
        onClose={() => setPageAction(null)}
      />
      <DepartmentDeletionDialog
        isOpen={pageAction?.action === 'delete'}
        department={
          pageAction?.action === 'delete' ? pageAction.department : undefined
        }
        isDeleting={isLoading}
        onConfirm={() => {
          void confirmDelete();
        }}
        onClose={() => setPageAction(null)}
      />
    </section>
  );
}
