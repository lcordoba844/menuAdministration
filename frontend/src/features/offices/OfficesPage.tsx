import { Building2, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';

import { useAuth } from '@/auth/auth-context';
import { useSnackbar } from '@/components/snackbar-context';
import { OfficeDeletionDialog } from '@/features/offices/components/OfficeDeletionDialog';
import { OfficeEditorDialog } from '@/features/offices/components/OfficeEditorDialog';
import { OfficeList } from '@/features/offices/components/OfficeList';
import { OfficeApi } from '@/features/offices/office.api';
import type {
  Office,
  SaveOfficeRequest,
} from '@/features/offices/office.types';

type PageAction =
  | { action: 'create' }
  | { action: 'edit'; office: Office }
  | { action: 'delete'; office: Office }
  | null;

export function OfficesPage(): ReactElement {
  const { api } = useAuth();
  const { showSnackbar } = useSnackbar();
  const officeApi = useMemo(() => new OfficeApi(api), [api]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageAction, setPageAction] = useState<PageAction>(null);
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadOffices = useCallback((): Promise<void> => {
    return officeApi
      .getAll()
      .then(setOffices)
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
  }, [officeApi, showSnackbar]);

  useEffect(() => {
    void loadOffices();
  }, [loadOffices]);

  function refresh(): void {
    setHasLoadError(false);
    setIsLoading(true);
    void loadOffices();
  }

  async function save(input: SaveOfficeRequest): Promise<void> {
    if (!pageAction || pageAction.action === 'delete' || isLoading) return;
    setIsLoading(true);
    try {
      if (pageAction.action === 'create') {
        const created = await officeApi.create(input);
        setOffices((previous) => [created, ...previous]);
        showSnackbar('success', 'Office created.');
      } else if (pageAction.action === 'edit') {
        const updated = await officeApi.update(pageAction.office.id, input);
        setOffices((previous) =>
          previous.map((office) =>
            office.id === updated.id ? updated : office,
          ),
        );
        showSnackbar('success', 'Office updated.');
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
      await officeApi.delete(pageAction.office.id);
      setOffices((previous) =>
        previous.filter((office) => office.id !== pageAction.office.id),
      );
      showSnackbar('success', 'Office deleted.');
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
    <section className="space-y-6 text-left" aria-labelledby="offices-title">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Building2 size={18} aria-hidden="true" />
            Administration
          </div>
          <h1 id="offices-title" className="text-3xl font-bold sm:text-4xl">
            Offices
          </h1>
          <p className="mt-3 text-base-content/65">
            Manage the places your diners belong to.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setPageAction({ action: 'create' })}
          disabled={isLoading || pageAction !== null}
        >
          <Plus size={18} aria-hidden="true" />
          Create office
        </button>
      </header>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          Office directory
          {(!isLoading || pageAction !== null) && offices.length > 0 && (
            <span className="badge badge-neutral badge-sm">
              {offices.length}
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
          Loading offices…
        </div>
      )}
      {!isLoading && hasLoadError && pageAction === null && (
        <div
          role="alert"
          className="rounded-box border border-error/30 bg-base-100 p-6"
        >
          <p className="text-error">
            Unable to load offices. Please try again.
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
        (offices.length > 0 || !hasLoadError || pageAction !== null) && (
          <OfficeList
            offices={offices}
            disabled={isLoading || pageAction !== null}
            onCreate={() => setPageAction({ action: 'create' })}
            onEdit={(office) => setPageAction({ action: 'edit', office })}
            onDelete={(office) => setPageAction({ action: 'delete', office })}
          />
        )}
      <OfficeEditorDialog
        key={
          pageAction?.action === 'edit'
            ? pageAction.office.id
            : (pageAction?.action ?? 'closed')
        }
        isOpen={
          pageAction?.action === 'create' || pageAction?.action === 'edit'
        }
        office={pageAction?.action === 'edit' ? pageAction.office : undefined}
        isSaving={isLoading}
        onSave={save}
        onClose={() => setPageAction(null)}
      />
      <OfficeDeletionDialog
        isOpen={pageAction?.action === 'delete'}
        office={pageAction?.action === 'delete' ? pageAction.office : undefined}
        isDeleting={isLoading}
        onConfirm={() => {
          void confirmDelete();
        }}
        onClose={() => setPageAction(null)}
      />
    </section>
  );
}
