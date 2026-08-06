import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { CompanyInput, CompanyResponse, CompanyFilters } from '@/types/company';

class CompanyService {
  async getAll(filters: CompanyFilters = {}): Promise<PaginatedResponse<CompanyResponse>> {
    const { page = 1, size = 10 } = filters;
    const response = await api.get<ApiResponse<CompanyResponse[]>>('/Company', { page, size });

    return {
      content: response.data || [],
      totalElements: response.data?.length || 0,
      totalPages: Math.ceil((response.data?.length || 0) / size),
      size,
      number: page,
    };
  }

  async create(data: CompanyInput): Promise<CompanyResponse> {
    const response = await api.post<ApiResponse<CompanyResponse>>('/Company', data);
    return response.data;
  }

  async update(data: CompanyInput): Promise<CompanyResponse> {
    const response = await api.put<ApiResponse<CompanyResponse>>('/Company', data);
    return response.data;
  }

  async delete(data: CompanyInput): Promise<void> {
    await api.delete('/Company', data);
  }
}

export const companyService = new CompanyService();
export default companyService;
