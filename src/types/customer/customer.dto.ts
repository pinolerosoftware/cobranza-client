export interface Customer {
  customerId?: number;
  firstName: string;
  lastName: string;
  dni?: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  companyId?: number;
  createAt?: string;
  updateAt?: string | null;
}