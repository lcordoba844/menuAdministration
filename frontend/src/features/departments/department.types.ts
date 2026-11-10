export interface Department {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SaveDepartmentRequest = Pick<Department, 'name' | 'description'>;
