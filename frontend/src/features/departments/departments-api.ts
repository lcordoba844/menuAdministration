import type { AxiosInstance } from 'axios';

import type {
  Department,
  DepartmentInput,
} from '@/features/departments/departments-types';

export async function getDepartments(
  api: AxiosInstance,
): Promise<Department[]> {
  const { data } = await api.get<Department[]>('/departments');
  return data;
}

export async function createDepartment(
  api: AxiosInstance,
  input: DepartmentInput,
): Promise<Department> {
  const { data } = await api.post<Department>('/departments', input);
  return data;
}

export async function updateDepartment(
  api: AxiosInstance,
  id: string,
  input: DepartmentInput,
): Promise<Department> {
  const { data } = await api.put<Department>(`/departments/${id}`, input);
  return data;
}

export async function deleteDepartment(
  api: AxiosInstance,
  id: string,
): Promise<void> {
  await api.delete(`/departments/${id}`);
}
