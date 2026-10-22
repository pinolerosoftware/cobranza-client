import api from './api';
import type { ApiResponse } from '@/types/api';
import type { LoanPreview, LoanPreviewInput } from '@/types/loan';
import { toPascalCaseKeys, toCamelCaseKeys } from '@/lib/casing';

interface LoanInstallmentOutputDto {
  Id: number;
  LoanId: number;
  Number: number;
  DueDate: string;
  Amount: number;
  Inerest: number;
  Capital: number;
  RemainingBalance: number;
  IsPaid: boolean;
}

interface LoanOutputDto {
  Id: number;
  LoanApplicationId: number;
  Amount: number;
  InterestRate: number;
  Term: number;
  TotalInterest: number;
  Total: number;
  Frequency: number;
  InterestType: number;
  StartDate: string;
  Installments: LoanInstallmentOutputDto[];
}

function normalizePreviewResponse(data: LoanOutputDto): LoanPreview {
  const camelData = toCamelCaseKeys(data) as unknown as Record<string, unknown>;

  const rawInstallments = Array.isArray(camelData.installments)
    ? (camelData.installments as Record<string, unknown>[])
    : [];

  const installments = rawInstallments.map((installment) => {
    const { inerest, ...rest } = installment;
    return { ...rest, interest: inerest };
  });

  return { ...camelData, installments } as unknown as LoanPreview;
}

class LoanService {
  async preview(data: LoanPreviewInput): Promise<LoanPreview> {
    const payload = toPascalCaseKeys(data);
    const response = await api.post<ApiResponse<LoanOutputDto>>('/Loan/Preview', payload);

    if (!response.success) {
      throw new Error(response.message || 'Error al calcular el plan de pagos');
    }

    if (!response.data) {
      throw new Error('No se recibió información del plan de pagos');
    }

    return normalizePreviewResponse(response.data);
  }

  async approve(data: LoanPreviewInput): Promise<LoanPreview> {
    const payload = toPascalCaseKeys(data);
    const response = await api.post<ApiResponse<LoanOutputDto>>('/Loan/Approve', payload);

    if (!response.success) {
      throw new Error(response.message || 'Error al aprobar el préstamo');
    }

    if (!response.data) {
      throw new Error('No se recibió información del préstamo aprobado');
    }

    return normalizePreviewResponse(response.data);
  }
}

export const loanService = new LoanService();
export default loanService;
