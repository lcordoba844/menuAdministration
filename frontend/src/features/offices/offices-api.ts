import type { AxiosInstance } from 'axios';

import type { Office, OfficeInput } from '@/features/offices/offices-types';

export async function getOffices(api: AxiosInstance): Promise<Office[]> {
  const { data } = await api.get<Office[]>('/offices');
  return data;
}

export async function createOffice(
  api: AxiosInstance,
  input: OfficeInput,
): Promise<Office> {
  const { data } = await api.post<Office>('/offices', input);
  return data;
}

export async function updateOffice(
  api: AxiosInstance,
  id: string,
  input: OfficeInput,
): Promise<Office> {
  const { data } = await api.put<Office>(`/offices/${id}`, input);
  return data;
}

export async function deleteOffice(
  api: AxiosInstance,
  id: string,
): Promise<void> {
  await api.delete(`/offices/${id}`);
}
