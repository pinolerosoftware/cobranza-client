import { useState } from 'react';
import { customerService } from '@/services/customerService';
import { type Customer } from '@/types/customer';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async (page: number = 1, size: number = 10, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getAll(page, size, name);
      setCustomers(response.content);
      return response;
    } catch (err) {
      setError('Error fetching customers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNewCustomer = async (customerData: Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await customerService.create(customerData);
      setCustomers(prev => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      setError('Error creating customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingCustomer = async (customerData: Customer) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCustomer = await customerService.update(customerData);
      setCustomers(prev =>
        prev.map(c => c.customerId === customerData.customerId ? updatedCustomer : c)
      );
      return updatedCustomer;
    } catch (err) {
      setError('Error updating customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerById = async (customerId: number) => {
    setLoading(true);
    setError(null);
    try {
      const customer = customers.find(c => c.customerId === customerId);
      if (customer) {
        await customerService.delete(customer);
      }
      setCustomers(prev => prev.filter(c => c.customerId !== customerId));
    } catch (err) {
      setError('Error deleting customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createNewCustomer,
    updateExistingCustomer,
    deleteCustomerById,
  };
};
