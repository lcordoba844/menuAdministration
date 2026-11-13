import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { DepartmentApi } from '@/features/departments/department.api';
import type {
  Department,
  SaveDepartmentRequest,
} from '@/features/departments/department.types';

interface DepartmentsViewModel {
  departments: Department[];
  isLoading: boolean;
  loadError: Error | null;
  refresh: () => void;
  createDepartment: (input: SaveDepartmentRequest) => Promise<Department>;
  updateDepartment: (
    id: string,
    input: SaveDepartmentRequest,
  ) => Promise<Department>;
  deleteDepartment: (id: string) => Promise<void>;
}

export function useDepartmentsViewModel(): DepartmentsViewModel {
  const { api } = useAuth();
  const departmentApi = useMemo(() => new DepartmentApi(api), [api]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const loadDepartments = useCallback((): Promise<void> => {
    return departmentApi
      .getAll()
      .then(setDepartments)
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error
            ? error
            : new Error('An unexpected error occurred.'),
        );
      })
      .finally(() => setIsLoading(false));
  }, [departmentApi]);

  useEffect(() => {
    void loadDepartments();
  }, [loadDepartments]);

  function refresh(): void {
    setLoadError(null);
    setIsLoading(true);
    void loadDepartments();
  }

  async function createDepartment(
    input: SaveDepartmentRequest,
  ): Promise<Department> {
    setIsLoading(true);
    try {
      const created = await departmentApi.create(input);
      setDepartments((previous) => [created, ...previous]);
      return created;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDepartment(
    id: string,
    input: SaveDepartmentRequest,
  ): Promise<Department> {
    setIsLoading(true);
    try {
      const updated = await departmentApi.update(id, input);
      setDepartments((previous) =>
        previous.map((department) =>
          department.id === updated.id ? updated : department,
        ),
      );
      return updated;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteDepartment(id: string): Promise<void> {
    setIsLoading(true);
    try {
      await departmentApi.delete(id);
      setDepartments((previous) =>
        previous.filter((department) => department.id !== id),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return {
    departments,
    isLoading,
    loadError,
    refresh,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}
