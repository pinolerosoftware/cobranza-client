import { useState } from 'react';
import { 
  createCustomer, 
  getCustomers, 
  updateCustomer, 
  deleteCustomer,
  type Customer
} from '@/services/customerService';

// Custom hook for customer management
export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers with pagination
  const fetchCustomers = async (page: number = 1, size: number = 10, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomers(page, size, name);
      setCustomers(response.customers);
      return response;
    } catch (err) {
      setError('Error fetching customers');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new customer
  const createNewCustomer = async (customerData: Omit<Customer, 'customerId' | 'createAt' | 'updateAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await createCustomer(customerData);
      setCustomers(prev => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      setError('Error creating customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing customer
  const updateExistingCustomer = async (customerData: Customer) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCustomer = await updateCustomer(customerData);
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

  // Delete a customer
  const deleteCustomerById = async (customerId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCustomer(customerId);
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
    deleteCustomerById
  };
};