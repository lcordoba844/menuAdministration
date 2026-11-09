import axios from 'axios';
import { Building2, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { useAuth } from '@/auth/auth-context';
import { DeleteOfficeDialog } from '@/features/offices/components/DeleteOfficeDialog';
import { OfficeForm } from '@/features/offices/components/OfficeForm';
import { OfficeList } from '@/features/offices/components/OfficeList';
import {
  createOffice,
  deleteOffice,
  getOffices,
  updateOffice,
} from '@/features/offices/offices-api';
import type { Office, OfficeInput } from '@/features/offices/offices-types';

type ModalState =
  | { action: 'create' }
  | { action: 'edit'; office: Office }
  | { action: 'delete'; office: Office }
  | null;

type FeedbackState = { type: 'success' | 'error'; text: string } | null;

function getOfficeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 400:
        return 'Check the office details and try again.';
      case 401:
        return 'Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'This office is no longer available. Refresh the list and try again.';
      case 409:
        return 'This action conflicts with an existing record.';
    }
  }
  return 'An error ocurred. Please, try again later.';
}

export function OfficesPage(): ReactElement {
  const { api } = useAuth();
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const loadOffices = useCallback((): Promise<void> => {
    return getOffices(api)
      .then(setOffices)
      .catch((error: unknown) => {
        setFeedback({
          type: 'error',
          text: getOfficeError(error),
        });
      })
      .finally(() => setIsLoading(false));
  }, [api]);

  useEffect(() => {
    void loadOffices();
  }, [loadOffices]);

  function refresh(): void {
    setIsLoading(true);
    setFeedback(null);
    void loadOffices();
  }

  function openModal(next: ModalState): void {
    setFeedback(null);
    setModal(next);
  }

  async function save(input: OfficeInput): Promise<void> {
    if (!modal || modal.action === 'delete' || isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      if (modal.action === 'create') {
        const created = await createOffice(api, input);
        setOffices((previous) => [created, ...previous]);
        setFeedback({ type: 'success', text: 'Office created.' });
      } else if (modal.action === 'edit') {
        const updated = await updateOffice(api, modal.office.id, input);
        setOffices((previous) =>
          previous.map((office) =>
            office.id === updated.id ? updated : office,
          ),
        );
        setFeedback({ type: 'success', text: 'Office updated.' });
      }
      setModal(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getOfficeError(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!modal || modal.action !== 'delete' || isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      await deleteOffice(api, modal.office.id);
      setOffices((previous) =>
        previous.filter((office) => office.id !== modal.office.id),
      );
      setFeedback({ type: 'success', text: 'Office deleted.' });
      setModal(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getOfficeError(error),
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
          onClick={() => openModal({ action: 'create' })}
          disabled={isLoading || modal !== null}
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
      {(modal?.action === 'create' || modal?.action === 'edit') && (
        <OfficeForm
          key={modal.action === 'edit' ? modal.office.id : 'create'}
          initialValue={modal.action === 'edit' ? modal.office : undefined}
          loading={isLoading}
          error={feedback?.type === 'error' ? feedback.text : ''}
          onSave={save}
          onCancel={() => setModal(null)}
        />
      )}
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          Office directory
          {(!isLoading || modal !== null) && offices.length > 0 && (
            <span className="badge badge-neutral badge-sm">
              {offices.length}
            </span>
          )}
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={refresh}
          disabled={isLoading || modal !== null}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </div>
      {isLoading && modal === null && (
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
      {!isLoading && feedback?.type === 'error' && modal === null && (
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
      {(!isLoading || modal !== null) &&
        (offices.length > 0 ||
          feedback?.type !== 'error' ||
          modal !== null) && (
          <OfficeList
            offices={offices}
            disabled={isLoading || modal !== null}
            onCreate={() => openModal({ action: 'create' })}
            onEdit={(office) => openModal({ action: 'edit', office })}
            onDelete={(office) => openModal({ action: 'delete', office })}
          />
        )}
      {modal?.action === 'delete' && (
        <DeleteOfficeDialog
          office={modal.office}
          loading={isLoading}
          error={feedback?.type === 'error' ? feedback.text : ''}
          onConfirm={() => {
            void confirmDelete();
          }}
          onCancel={() => setModal(null)}
        />
      )}
    </section>
  );
}
