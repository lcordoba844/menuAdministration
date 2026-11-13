import { Building2, Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { useSnackbar } from '@/components/snackbar-context';
import { OfficeDeletionDialog } from '@/features/offices/components/OfficeDeletionDialog';
import { OfficeEditorDialog } from '@/features/offices/components/OfficeEditorDialog';
import { OfficeList } from '@/features/offices/components/OfficeList';
import type {
  Office,
  SaveOfficeRequest,
} from '@/features/offices/office.types';
import { useOfficesViewModel } from '@/features/offices/useOfficesViewModel';

type PageAction =
  | { action: 'create' }
  | { action: 'edit'; office: Office }
  | { action: 'delete'; office: Office }
  | null;

export function OfficesPage(): ReactElement {
  const { showSnackbar } = useSnackbar();
  const viewModel = useOfficesViewModel();
  const [pageAction, setPageAction] = useState<PageAction>(null);
  const hasLoadError = viewModel.loadError !== null;

  useEffect(() => {
    if (viewModel.loadError) showSnackbar('error', viewModel.loadError.message);
  }, [viewModel.loadError, showSnackbar]);

  async function save(input: SaveOfficeRequest): Promise<void> {
    if (!pageAction || pageAction.action === 'delete' || viewModel.isLoading)
      return;
    try {
      if (pageAction.action === 'create') {
        await viewModel.createOffice(input);
        showSnackbar('success', 'Office created.');
      } else if (pageAction.action === 'edit') {
        await viewModel.updateOffice(pageAction.office.id, input);
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
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!pageAction || pageAction.action !== 'delete' || viewModel.isLoading)
      return;
    try {
      await viewModel.deleteOffice(pageAction.office.id);
      showSnackbar('success', 'Office deleted.');
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
          disabled={viewModel.isLoading || pageAction !== null}
        >
          <Plus size={18} aria-hidden="true" />
          Create office
        </button>
      </header>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          Office directory
          {(!viewModel.isLoading || pageAction !== null) &&
            viewModel.offices.length > 0 && (
              <span className="badge badge-neutral badge-sm">
                {viewModel.offices.length}
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
          Loading offices…
        </div>
      )}
      {!viewModel.isLoading && hasLoadError && pageAction === null && (
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
            onClick={viewModel.refresh}
          >
            Try again
          </button>
        </div>
      )}
      {(!viewModel.isLoading || pageAction !== null) &&
        (viewModel.offices.length > 0 ||
          !hasLoadError ||
          pageAction !== null) && (
          <OfficeList
            offices={viewModel.offices}
            disabled={viewModel.isLoading || pageAction !== null}
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
        isSaving={viewModel.isLoading}
        onSave={save}
        onClose={() => setPageAction(null)}
      />
      <OfficeDeletionDialog
        isOpen={pageAction?.action === 'delete'}
        office={pageAction?.action === 'delete' ? pageAction.office : undefined}
        isDeleting={viewModel.isLoading}
        onConfirm={() => {
          void confirmDelete();
        }}
        onClose={() => setPageAction(null)}
      />
    </section>
  );
}
