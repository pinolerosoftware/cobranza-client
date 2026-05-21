import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/companyService';
import type { CompanyInput, CompanyFilters } from '@/types/company';

export const COMPANY_QUERY_KEY = 'companies';

export const useCompanyList = (filters: CompanyFilters = {}) => {
  return useQuery({
    queryKey: [COMPANY_QUERY_KEY, filters],
    queryFn: () => companyService.getAll(filters.page, filters.size),
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyInput) => companyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyInput) => companyService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyInput) => companyService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
    },
  });
};
