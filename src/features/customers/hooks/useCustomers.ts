import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/services/customerService';

export const CUSTOMER_QUERY_KEY = 'customers';

export const useCustomers = (page: number = 1, size: number = 10, name?: string) => {
  return useQuery({
    queryKey: [CUSTOMER_QUERY_KEY, page, size, name],
    queryFn: () => getCustomers(page, size, name),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};
