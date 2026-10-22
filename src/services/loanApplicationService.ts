import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { LoanApplication, LoanApplicationInput, LoanApplicationUpdate, LoanApplicationFilters } from '@/types/loan-application';
import { toPascalCaseKeys, toCamelCaseKeys } from '@/lib/casing';

interface LoanApplicationOutputDto {
  LoanApplicationId: number;
  CustomerId: number;
  FirstName: string;
  LastName: string;
  Dni: string | null;
  Frequency: number;
  Amount: number;
  Description: string;
  DateApplication: string;
  DateApproved: string | null;
  DateRejected: string | null;
  Status: number;
  CurrencyId: number | null;
  CurrencyCode: string | null;
  CurrencyName: string | null;
  Active: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
}

class LoanApplicationService {
  async getAll(filters: LoanApplicationFilters = {}): Promise<PaginatedResponse<LoanApplication>> {
    const { page = 1, size = 10, dni, currencyId } = filters;
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      size,
      ...(dni ? { dni } : {}),
      ...(currencyId ? { currencyId } : {}),
    };

    const response = await api.get<ApiResponse<LoanApplicationOutputDto[]> & { rowCount: number }>(
      '/LoanApplication',
      params
    );

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener las solicitudes de préstamo');
    }

    const content = toCamelCaseKeys(response.data || []) as unknown as LoanApplication[];
    const totalElements = response.rowCount ?? response.data?.length ?? 0;

    return {
      content,
      totalElements,
      totalPages: Math.ceil(totalElements / size) || 1,
      size,
      number: page,
    };
  }

  async create(data: LoanApplicationInput): Promise<LoanApplication> {
    const payload = toPascalCaseKeys({ ...data, active: true });
    const response = await api.post<ApiResponse<LoanApplicationOutputDto>>('/LoanApplication', payload);

    if (!response.success) {
      throw new Error(response.message || 'Error al crear la solicitud de préstamo');
    }

    return toCamelCaseKeys(response.data) as unknown as LoanApplication;
  }

  async update(data: LoanApplicationUpdate): Promise<LoanApplication> {
    const payload = toPascalCaseKeys({ ...data, active: true });
    const response = await api.put<ApiResponse<LoanApplicationOutputDto>>('/LoanApplication', payload);

    if (!response.success) {
      throw new Error(response.message || 'Error al actualizar la solicitud de préstamo');
    }

    return toCamelCaseKeys(response.data) as unknown as LoanApplication;
  }

  async delete(data: LoanApplicationInput): Promise<void> {
    const payload = toPascalCaseKeys(data);
    const response = await api.delete<ApiResponse<LoanApplicationOutputDto>>('/LoanApplication', payload);

    if (response && !response.success) {
      throw new Error(response.message || 'Error al eliminar la solicitud de préstamo');
    }
  }

  async reject(loanApplicationId: number, reason?: string): Promise<LoanApplication> {
    const payload = toPascalCaseKeys({ loanApplicationId, reason });
    const response = await api.post<ApiResponse<LoanApplicationOutputDto>>('/LoanApplication/Reject', payload);

    if (!response.success) {
      throw new Error(response.message || 'Error al rechazar la solicitud de préstamo');
    }

    return toCamelCaseKeys(response.data) as unknown as LoanApplication;
  }
}

export const loanApplicationService = new LoanApplicationService();
export default loanApplicationService;
