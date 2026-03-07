import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusta la URL según tu backend
  timeout: 1000,
});

// Customer interface
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

// Create customer
export const createCustomer = async (customerData: Omit<Customer, 'customerId' | 'createAt' | 'updateAt'>) => {
  try {
    const response = await instance.post<Customer>('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Error creating customer');
  }
};

// Get customers with pagination
export const getCustomers = async (page: number = 1, size: number = 10, name?: string) => {
  try {
    const params: { page: number; size: number; name?: string } = { page, size };
    if (name) {
      params.name = name;
    }
    
    const response = await instance.get<{ customers: Customer[]; total: number }>('/customers', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Error fetching customers');
  }
};

// Update customer
export const updateCustomer = async (customerData: Customer) => {
  try {
    const response = await instance.put<Customer>(`/customers/${customerData.customerId}`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw new Error('Error updating customer');
  }
};

// Delete customer
export const deleteCustomer = async (customerId: number) => {
  try {
    const response = await instance.delete(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw new Error('Error deleting customer');
  }
};