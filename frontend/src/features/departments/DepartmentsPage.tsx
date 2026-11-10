import axios from 'axios';
import { Network, Plus, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import { useAuth } from '@/auth/auth-context';
import { DeleteDepartmentDialog } from '@/features/departments/components/DeleteDepartmentDialog';
import { DepartmentForm } from '@/features/departments/components/DepartmentForm';
import { DepartmentList } from '@/features/departments/components/DepartmentList';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from '@/features/departments/departments-api';
import type {
  Department,
  DepartmentInput,
} from '@/features/departments/departments-types';

type ModalState =
  | { action: 'create' }
  | { action: 'edit'; department: Department }
  | { action: 'delete'; department: Department }
  | null;

type FeedbackState = { type: 'success' | 'error'; text: string } | null;

function getDepartmentError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 400:
        return 'Check the department details and try again.';
      case 401:
        return 'Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'This department is no longer available. Refresh the list and try again.';
      case 409:
        return 'This action conflicts with an existing record.';
    }
  }
  return 'An error occurred. Please try again later.';
}

export function DepartmentsPage(): ReactElement {
  const { api } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const loadDepartments = useCallback((): Promise<void> => {
    return getDepartments(api)
      .then(setDepartments)
      .catch((error: unknown) => {
        setFeedback({
          type: 'error',
          text: getDepartmentError(error),
        });
      })
      .finally(() => setIsLoading(false));
  }, [api]);

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);

  function refresh(): void {
    setIsLoading(true);
    setFeedback(null);
    void loadDepartments();
  }

  function openModal(next: ModalState): void {
    setFeedback(null);
    setModal(next);
  }

  async function save(input: DepartmentInput): Promise<void> {
    if (!modal || modal.action === 'delete' || isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      if (modal.action === 'create') {
        const created = await createDepartment(api, input);
        setDepartments((previous) => [created, ...previous]);
        setFeedback({ type: 'success', text: 'Department created.' });
      } else if (modal.action === 'edit') {
        const updated = await updateDepartment(api, modal.department.id, input);
        setDepartments((previous) =>
          previous.map((department) =>
            department.id === updated.id ? updated : department,
          ),
        );
        setFeedback({ type: 'success', text: 'Department updated.' });
      }
      setModal(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getDepartmentError(error),
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
      await deleteDepartment(api, modal.department.id);
      setDepartments((previous) =>
        previous.filter((department) => department.id !== modal.department.id),
      );
      setFeedback({ type: 'success', text: 'Department deleted.' });
      setModal(null);
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getDepartmentError(error),
      });
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
          onClick={() => openModal({ action: 'create' })}
          disabled={isLoading || modal !== null}
        >
          <Plus size={18} aria-hidden="true" />
          Create department
        </button>
      </header>
      <div role="status" aria-live="polite">
        {feedback?.type === 'success' && (
          <p className="alert alert-success text-sm">{feedback.text}</p>
        )}
      </div>
      {(modal?.action === 'create' || modal?.action === 'edit') && (
        <DepartmentForm
          key={modal.action === 'edit' ? modal.department.id : 'create'}
          initialValue={modal.action === 'edit' ? modal.department : undefined}
          loading={isLoading}
          error={feedback?.type === 'error' ? feedback.text : ''}
          onSave={save}
          onCancel={() => setModal(null)}
        />
      )}
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold">
          Department directory
          {(!isLoading || modal !== null) && departments.length > 0 && (
            <span className="badge badge-neutral badge-sm">
              {departments.length}
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
          Loading departments…
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
        (departments.length > 0 ||
          feedback?.type !== 'error' ||
          modal !== null) && (
          <DepartmentList
            departments={departments}
            disabled={isLoading || modal !== null}
            onCreate={() => openModal({ action: 'create' })}
            onEdit={(department) => openModal({ action: 'edit', department })}
            onDelete={(department) =>
              openModal({ action: 'delete', department })
            }
          />
        )}
      {modal?.action === 'delete' && (
        <DeleteDepartmentDialog
          department={modal.department}
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
