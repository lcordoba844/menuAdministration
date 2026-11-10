import { Building2, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';

import { useAuth } from '@/auth/auth-context';
import { DeleteOfficeDialog } from '@/features/offices/components/DeleteOfficeDialog';
import { OfficeForm } from '@/features/offices/components/OfficeForm';
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

type FeedbackState = { type: 'success' | 'error'; text: string } | null;

export function OfficesPage(): ReactElement {
  const { api } = useAuth();
  const officeApi = useMemo(() => new OfficeApi(api), [api]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageAction, setPageAction] = useState<PageAction>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const loadOffices = useCallback((): Promise<void> => {
    return officeApi
      .getAll()
      .then(setOffices)
      .catch((error: unknown) => {
        setFeedback({
          type: 'error',
          text:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred.',
        });
      })
      .finally(() => setIsLoading(false));
  }, [officeApi]);

  useEffect(() => {
    void loadOffices();
  }, [loadOffices]);

  function refresh(): void {
    setIsLoading(true);
    setFeedback(null);
    void loadOffices();
  }

  function selectAction(next: PageAction): void {
    setFeedback(null);
    setPageAction(next);
  }

  async function save(input: SaveOfficeRequest): Promise<void> {
    if (!pageAction || pageAction.action === 'delete' || isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      if (pageAction.action === 'create') {
        const created = await officeApi.create(input);
        setOffices((previous) => [created, ...previous]);
        setFeedback({ type: 'success', text: 'Office created.' });
      } else if (pageAction.action === 'edit') {
        const updated = await officeApi.update(pageAction.office.id, input);
        setOffices((previous) =>
          previous.map((office) =>
            office.id === updated.id ? updated : office,
          ),
        );
        setFeedback({ type: 'success', text: 'Office updated.' });
      }
      setPageAction(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!pageAction || pageAction.action !== 'delete' || isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      await officeApi.delete(pageAction.office.id);
      setOffices((previous) =>
        previous.filter((office) => office.id !== pageAction.office.id),
      );
      setFeedback({ type: 'success', text: 'Office deleted.' });
      setPageAction(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
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
          onClick={() => selectAction({ action: 'create' })}
          disabled={isLoading || pageAction !== null}
        >
          <Plus size={18} aria-hidden="true" />
          Create office
        </button>
      </header>
      <div role="status" aria-live="polite">
        {feedback?.type === 'success' && (
          <p className="alert alert-success text-sm">{feedback.text}</p>
        )}
      </div>
      {(pageAction?.action === 'create' || pageAction?.action === 'edit') && (
        <OfficeForm
          key={pageAction.action === 'edit' ? pageAction.office.id : 'create'}
          initialValue={
            pageAction.action === 'edit' ? pageAction.office : undefined
          }
          isSaving={isLoading}
          error={feedback?.type === 'error' ? feedback.text : ''}
          onSave={save}
          onCancel={() => setPageAction(null)}
        />
      )}
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
      {!isLoading && feedback?.type === 'error' && pageAction === null && (
        <div
          role="alert"
          className="rounded-box border border-error/30 bg-base-100 p-6"
        >
          <p className="text-error">{feedback.text}</p>
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
        (offices.length > 0 ||
          feedback?.type !== 'error' ||
          pageAction !== null) && (
          <OfficeList
            offices={offices}
            disabled={isLoading || pageAction !== null}
            onCreate={() => selectAction({ action: 'create' })}
            onEdit={(office) => selectAction({ action: 'edit', office })}
            onDelete={(office) => selectAction({ action: 'delete', office })}
          />
        )}
      {pageAction?.action === 'delete' && (
        <DeleteOfficeDialog
          office={pageAction.office}
          isDeleting={isLoading}
          error={feedback?.type === 'error' ? feedback.text : ''}
          onConfirm={() => {
            void confirmDelete();
          }}
          onCancel={() => setPageAction(null)}
        />
      )}
    </section>
  );
}
