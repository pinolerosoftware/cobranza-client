export interface Customer {
  customerId?: number;
  firstName: string;
  lastName: string;
  dni?: string;
  passport?: string | null;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  active: boolean;
  companyId?: number;
  createdAt?: string;
  updatedAt?: string | null;
}