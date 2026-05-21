import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { CompanyInput, CompanyResponse } from '@/types/company';

class CompanyService {
  async getAll(page: number = 1, size: number = 10): Promise<PaginatedResponse<CompanyResponse>> {
    const response = await api.get<ApiResponse<CompanyResponse[]>>('/Company', { params: { page, size } });

    return {
      content: response.data.data,
      totalElements: response.data.data.length,
      totalPages: Math.ceil(response.data.data.length / size),
      size,
      number: page,
    };
  }

  async create(data: CompanyInput): Promise<CompanyResponse> {
    const response = await api.post<ApiResponse<CompanyResponse>>('/Company', data);
    return response.data.data;
  }

  async update(data: CompanyInput): Promise<CompanyResponse> {
    const response = await api.put<ApiResponse<CompanyResponse>>('/Company', data);
    return response.data.data;
  }

  async delete(data: CompanyInput): Promise<void> {
    await api.delete('/Company', { data });
  }
}

export const companyService = new CompanyService();
export default companyService;
