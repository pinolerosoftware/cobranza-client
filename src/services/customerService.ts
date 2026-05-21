import api from './api';
import { type Customer } from '@/types/customer';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

type CreateCustomerData = Omit<Customer, 'customerId' | 'createdAt' | 'updatedAt'>;

class CustomerService {
  private toApiPayload(data: CreateCustomerData | Customer): Record<string, unknown> {
    const { phone, phoneNumber, ...rest } = data;
    return {
      ...rest,
      phoneNumber: phone || phoneNumber || null,
    };
  }

  private fromApiResponse(data: Record<string, unknown>): Customer {
    const { phoneNumber, ...rest } = data;
    return {
      ...rest,
      phone: (phoneNumber as string) || undefined,
    } as unknown as Customer;
  }

  async getAll(page: number = 1, size: number = 10, search?: string): Promise<PaginatedResponse<Customer>> {
    const params: { page: number; size: number; search?: string } = { page, size };
    if (search) {
      params.search = search;
    }

    const response = await api.get<ApiResponse<Record<string, unknown>[]>>('/Customer', { params });

    return {
      content: response.data.data.map((item) => this.fromApiResponse(item)),
      totalElements: response.data.data.length,
      totalPages: Math.ceil(response.data.data.length / size),
      size: size,
      number: page,
    };
  }

  async create(customerData: CreateCustomerData): Promise<Customer> {
    const payload = this.toApiPayload(customerData);
    const response = await api.post<ApiResponse<Record<string, unknown>>>('/Customer', payload);
    return this.fromApiResponse(response.data.data);
  }

  async update(customerData: Customer): Promise<Customer> {
    const payload = this.toApiPayload(customerData);
    const response = await api.put<ApiResponse<Record<string, unknown>>>('/Customer', payload);
    return this.fromApiResponse(response.data.data);
  }

  async delete(customerData: Customer): Promise<void> {
    const payload = this.toApiPayload(customerData);
    await api.delete('/Customer', { data: payload });
  }
}

export const customerService = new CustomerService();
export default customerService;
