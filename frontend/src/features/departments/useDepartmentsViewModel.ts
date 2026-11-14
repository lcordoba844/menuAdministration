import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '@/auth/auth-context';
import { DepartmentApi } from '@/features/departments/department.api';
import type {
  Department,
  SaveDepartmentRequest,
} from '@/features/departments/department.types';

const listKey = ['departments'] as const;

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
  const queryClient = useQueryClient();
  const list = useQuery({
    queryKey: listKey,
    queryFn: async ({ signal }): Promise<Department[]> => {
      return await departmentApi.getAll(signal);
    },
  });

  const creation = useMutation({
    mutationFn: async (input: SaveDepartmentRequest): Promise<Department> => {
      return await departmentApi.create(input);
    },
    onSuccess: async (created): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData<Department[]>(listKey, (previous = []) => [
        created,
        ...previous.filter((item) => item.id !== created.id),
      ]);
    },
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: SaveDepartmentRequest;
    }): Promise<Department> => {
      return await departmentApi.update(id, input);
    },
    onSuccess: async (updated): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData<Department[]>(listKey, (previous = []) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      );
    },
  });

  const deletion = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await departmentApi.delete(id);
    },
    onSuccess: async (_result, id): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData<Department[]>(listKey, (previous = []) =>
        previous.filter((item) => item.id !== id),
      );
    },
  });

  async function createDepartment(
    input: SaveDepartmentRequest,
  ): Promise<Department> {
    return await creation.mutateAsync(input);
  }

  async function updateDepartment(
    id: string,
    input: SaveDepartmentRequest,
  ): Promise<Department> {
    return await update.mutateAsync({ id, input });
  }

  async function deleteDepartment(id: string): Promise<void> {
    await deletion.mutateAsync(id);
  }

  function refresh(): void {
    void list.refetch({ throwOnError: false });
  }

  const isLoading =
    list.isPending ||
    list.isFetching ||
    creation.isPending ||
    update.isPending ||
    deletion.isPending;

  return {
    departments: list.data ?? [],
    isLoading,
    loadError: list.error,
    refresh,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
}
