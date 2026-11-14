import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '@/auth/auth-context';
import { OfficeApi } from '@/features/offices/office.api';
import type {
  Office,
  SaveOfficeRequest,
} from '@/features/offices/office.types';

const listKey = ['offices'] as const;

interface OfficesViewModel {
  offices: Office[];
  isLoading: boolean;
  loadError: Error | null;
  refresh: () => void;
  createOffice: (input: SaveOfficeRequest) => Promise<Office>;
  updateOffice: (id: string, input: SaveOfficeRequest) => Promise<Office>;
  deleteOffice: (id: string) => Promise<void>;
}

export function useOfficesViewModel(): OfficesViewModel {
  const { api } = useAuth();
  const officeApi = useMemo(() => new OfficeApi(api), [api]);
  const queryClient = useQueryClient();
  const list = useQuery({
    queryKey: listKey,
    queryFn: async ({ signal }): Promise<Office[]> => {
      return await officeApi.getAll(signal);
    },
  });

  const creation = useMutation({
    mutationFn: async (input: SaveOfficeRequest): Promise<Office> => {
      return await officeApi.create(input);
    },
    onSuccess: async (created): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData<Office[]>(listKey, (previous = []) => [
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
      input: SaveOfficeRequest;
    }): Promise<Office> => {
      return await officeApi.update(id, input);
    },
    onSuccess: async (updated): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData<Office[]>(listKey, (previous = []) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      );
    },
  });

  const deletion = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await officeApi.delete(id);
    },
    onSuccess: async (_result, id): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      queryClient.setQueryData<Office[]>(listKey, (previous = []) =>
        previous.filter((item) => item.id !== id),
      );
    },
  });

  async function createOffice(input: SaveOfficeRequest): Promise<Office> {
    return await creation.mutateAsync(input);
  }

  async function updateOffice(
    id: string,
    input: SaveOfficeRequest,
  ): Promise<Office> {
    return await update.mutateAsync({ id, input });
  }

  async function deleteOffice(id: string): Promise<void> {
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
    offices: list.data ?? [],
    isLoading,
    loadError: list.error,
    refresh,
    createOffice,
    updateOffice,
    deleteOffice,
  };
}
