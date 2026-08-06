import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/types/customer';

class CustomerService {
  private toApiPayload(data: Record<string, unknown>): Record<string, unknown> {
    const payload = { ...data };
    for (const key of Object.keys(payload)) {
      if (payload[key] === '') {
        payload[key] = null;
      }
    }
    return payload;
  }

  async getAll(page: number = 1, size: number = 10): Promise<PaginatedResponse<Customer>> {
    const response = await api.get<ApiResponse<Customer[]>>('/Customer', { page, size });

    return {
      content: response.data || [],
      totalElements: response.data?.length || 0,
      totalPages: Math.ceil((response.data?.length || 0) / size),
      size,
      number: page,
    };
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const response = await api.post<ApiResponse<Customer>>('/Customer', this.toApiPayload(data as Record<string, unknown>));
    return response.data;
  }

  async update(data: UpdateCustomerDTO): Promise<Customer> {
    const response = await api.put<ApiResponse<Customer>>('/Customer', this.toApiPayload(data as Record<string, unknown>));
    return response.data;
  }

  async delete(data: UpdateCustomerDTO): Promise<void> {
    await api.delete('/Customer', data);
  }
}

export const customerService = new CustomerService();
export default customerService;
