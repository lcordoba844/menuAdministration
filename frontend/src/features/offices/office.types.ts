export interface Office {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SaveOfficeRequest = Pick<
  Office,
  'name' | 'city' | 'country' | 'address'
>;
