import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/types/customer';
import { toPascalCaseKeys, toCamelCaseKeys } from '@/lib/casing';

class CustomerService {
  private toApiPayload(data: Record<string, unknown>): Record<string, unknown> {
    const payload: Record<string, unknown> = { ...data, active: true };
    for (const key of Object.keys(payload)) {
      if (payload[key] === '') {
        payload[key] = null;
      }
    }
    return toPascalCaseKeys(payload);
  }

  async getAll(page: number = 1, size: number = 10): Promise<PaginatedResponse<Customer>> {
    const response = await api.get<ApiResponse<Customer[]>>('/Customer', { page, size });
    const content = toCamelCaseKeys(response.data || []) as unknown as Customer[];

    return {
      content,
      totalElements: response.data?.length || 0,
      totalPages: Math.ceil((response.data?.length || 0) / size),
      size,
      number: page,
    };
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const response = await api.post<ApiResponse<Customer>>('/Customer', this.toApiPayload(data as Record<string, unknown>));
    return toCamelCaseKeys(response.data) as unknown as Customer;
  }

  async update(data: UpdateCustomerDTO): Promise<Customer> {
    const response = await api.put<ApiResponse<Customer>>('/Customer', this.toApiPayload(data as Record<string, unknown>));
    return toCamelCaseKeys(response.data) as unknown as Customer;
  }

  async delete(data: UpdateCustomerDTO): Promise<void> {
    await api.delete('/Customer', this.toApiPayload(data as Record<string, unknown>));
  }
}

export const customerService = new CustomerService();
export default customerService;
