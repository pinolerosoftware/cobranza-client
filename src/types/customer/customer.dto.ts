export interface Customer {
  customerId?: number;
  firstName: string;
  lastName: string;
  dni?: string | null;
  passport?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  active: boolean;
  createAt?: string;
  updateAt?: string | null;
}

export interface CreateCustomerDTO {
  firstName?: string;
  lastName?: string;
  dni?: string | null;
  passport?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  active?: boolean;
}

export interface UpdateCustomerDTO {
  customerId?: number;
  firstName?: string;
  lastName?: string;
  dni?: string | null;
  passport?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  active?: boolean;
}
