import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { LoanApplicationInput, LoanApplicationUpdate, LoanApplicationFilters } from '@/types/loan-application';

interface LoanApplicationResponse {
  loanApplicationId: number;
  customerId: number;
  frequency: number;
  amount: number;
  description: string;
  dateApplication: string;
  dateApproved: string | null;
  dateRejected: string | null;
  status: number;
  currencyId: number;
  active: boolean;
}

class LoanApplicationService {
  async getAll(filters: LoanApplicationFilters = {}): Promise<PaginatedResponse<LoanApplicationResponse>> {
    const { Page = 1, Size = 10, Dni, CurrencyId } = filters;
    const params: Record<string, string | number | boolean> = { Page, Size };
    if (Dni) params.Dni = Dni;
    if (CurrencyId) params.CurrencyId = CurrencyId;

    const response = await api.get<ApiResponse<LoanApplicationResponse[]>>('/LoanApplication', params);

    return {
      content: response.data || [],
      totalElements: response.data?.length || 0,
      totalPages: Math.ceil((response.data?.length || 0) / Size),
      size: Size,
      number: Page,
    };
  }

  async create(data: LoanApplicationInput): Promise<LoanApplicationResponse> {
    const response = await api.post<ApiResponse<LoanApplicationResponse>>('/LoanApplication', data);
    return response.data;
  }

  async update(data: LoanApplicationUpdate): Promise<LoanApplicationResponse> {
    const response = await api.put<ApiResponse<LoanApplicationResponse>>('/LoanApplication', data);
    return response.data;
  }

  async delete(data: LoanApplicationInput): Promise<void> {
    await api.delete('/LoanApplication', data);
  }
}

export const loanApplicationService = new LoanApplicationService();
export default loanApplicationService;
