import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loanApplicationService } from '@/services/loanApplicationService';
import type { LoanApplicationInput, LoanApplicationUpdate, LoanApplicationFilters } from '@/types/loan-application';

export const LOAN_APPLICATION_QUERY_KEY = 'loan-applications';

export const useLoanApplications = (filters: LoanApplicationFilters = {}) => {
  return useQuery({
    queryKey: [LOAN_APPLICATION_QUERY_KEY, filters],
    queryFn: () => loanApplicationService.getAll(filters),
  });
};

export const useCreateLoanApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationInput) => loanApplicationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOAN_APPLICATION_QUERY_KEY] });
    },
  });
};

export const useUpdateLoanApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationUpdate) => loanApplicationService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOAN_APPLICATION_QUERY_KEY] });
    },
  });
};

export const useDeleteLoanApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationInput) => loanApplicationService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOAN_APPLICATION_QUERY_KEY] });
    },
  });
};
