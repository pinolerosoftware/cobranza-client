import { useMutation } from '@tanstack/react-query';
import { loanService } from '@/services/loanService';
import type { LoanPreviewInput } from '@/types/loan';

export const LOAN_PREVIEW_MUTATION_KEY = 'loan-preview';

export const useLoanPreview = () => {
  return useMutation({
    mutationKey: [LOAN_PREVIEW_MUTATION_KEY],
    mutationFn: (data: LoanPreviewInput) => loanService.preview(data),
  });
};
