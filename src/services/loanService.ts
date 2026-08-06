import api from './api';
import type { ApiResponse } from '@/types/api';
import type { LoanPreview, LoanPreviewInput } from '@/types/loan';

class LoanService {
  async preview(data: LoanPreviewInput): Promise<LoanPreview> {
    const response = await api.post<ApiResponse<LoanPreview>>('/Loan/Preview', data);
    return response.data;
  }
}

export const loanService = new LoanService();
export default loanService;
