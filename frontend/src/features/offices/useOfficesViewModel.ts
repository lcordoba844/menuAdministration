import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { OfficeApi } from '@/features/offices/office.api';
import type {
  Office,
  SaveOfficeRequest,
} from '@/features/offices/office.types';

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
  const [offices, setOffices] = useState<Office[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const loadOffices = useCallback((): Promise<void> => {
    return officeApi
      .getAll()
      .then(setOffices)
      .catch((error: unknown) => {
        setLoadError(
          error instanceof Error
            ? error
            : new Error('An unexpected error occurred.'),
        );
      })
      .finally(() => setIsLoading(false));
  }, [officeApi]);

  useEffect(() => {
    void loadOffices();
  }, [loadOffices]);

  function refresh(): void {
    setLoadError(null);
    setIsLoading(true);
    void loadOffices();
  }

  async function createOffice(input: SaveOfficeRequest): Promise<Office> {
    setIsLoading(true);
    try {
      const created = await officeApi.create(input);
      setOffices((previous) => [created, ...previous]);
      return created;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOffice(
    id: string,
    input: SaveOfficeRequest,
  ): Promise<Office> {
    setIsLoading(true);
    try {
      const updated = await officeApi.update(id, input);
      setOffices((previous) =>
        previous.map((office) => (office.id === updated.id ? updated : office)),
      );
      return updated;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteOffice(id: string): Promise<void> {
    setIsLoading(true);
    try {
      await officeApi.delete(id);
      setOffices((previous) => previous.filter((office) => office.id !== id));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    offices,
    isLoading,
    loadError,
    refresh,
    createOffice,
    updateOffice,
    deleteOffice,
  };
}
