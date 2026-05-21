import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import { type Customer } from '@/types/customer';

export const CUSTOMER_QUERY_KEY = 'customers';

export const useCustomers = (page: number = 1, size: number = 10, search?: string) => {
  return useQuery({
    queryKey: [CUSTOMER_QUERY_KEY, page, size, search],
    queryFn: () => customerService.getAll(page, size, search),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof customerService.create>[0]) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof customerService.update>[0]) => customerService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: Customer) => customerService.delete(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};
