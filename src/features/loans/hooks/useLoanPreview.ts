import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loanService } from '@/services/loanService';
import type { LoanPreviewInput } from '@/types/loan';

export const LOAN_PREVIEW_MUTATION_KEY = 'loan-preview';
export const LOAN_APPROVE_MUTATION_KEY = 'loan-approve';
export const LOANS_QUERY_KEY = 'loans';

export const useLoanPreview = () => {
  return useMutation({
    mutationKey: [LOAN_PREVIEW_MUTATION_KEY],
    mutationFn: (data: LoanPreviewInput) => loanService.preview(data),
  });
};

export const useApproveLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [LOAN_APPROVE_MUTATION_KEY],
    mutationFn: (data: LoanPreviewInput) => loanService.approve(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOANS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
    },
  });
};
