import api from './api';
import { Customer } from '@/types/customer';

// Get customers with pagination
export const getCustomers = async (page: number = 1, size: number = 10, name?: string) => {
  const params: { page: number; size: number; name?: string } = { page, size };
  if (name) {
    params.name = name;
  }
  
  const response = await api.get<{ customers: Customer[]; total: number }>('/customers', { params });
  return response.data;
};

// Create customer
export const createCustomer = async (customerData: Omit<Customer, 'customerId' | 'createAt' | 'updateAt'>) => {
  const response = await api.post<Customer>('/customers', customerData);
  return response.data;
};

// Update customer
export const updateCustomer = async (customerData: Customer) => {
  const response = await api.put<Customer>(`/customers/${customerData.customerId}`, customerData);
  return response.data;
};

// Delete customer
export const deleteCustomer = async (customerId: number) => {
  const response = await api.delete(`/customers/${customerId}`);
  return response.data;
};
