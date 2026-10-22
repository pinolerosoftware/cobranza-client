import { z } from 'zod';

export const StatusLoanApplicationValues = {
  Approved: 1,
  Pending: 2,
  Rejected: 3,
} as const;

export type StatusLoanApplication = typeof StatusLoanApplicationValues[keyof typeof StatusLoanApplicationValues];

export const FrequencyValues = {
  Daily: 1,
  Weekly: 2,
  Biweekly: 3,
  Monthly: 4,
} as const;

export type Frequency = typeof FrequencyValues[keyof typeof FrequencyValues];

export const loanApplicationInputSchema = z.object({
  loanApplicationId: z.number().optional(),
  customerId: z.number().positive('Debes seleccionar un cliente'),
  frequency: z.nativeEnum(FrequencyValues),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
  dateApplication: z.string().min(1, 'La fecha de solicitud es requerida'),
  dateApproved: z.string().nullable().optional(),
  dateRejected: z.string().nullable().optional(),
  status: z.nativeEnum(StatusLoanApplicationValues),
  currencyId: z.number().positive('Debes seleccionar una moneda'),
});

export const loanApplicationUpdateSchema = z.object({
  loanApplicationId: z.number(),
  customerId: z.number().positive('Debes seleccionar un cliente').optional(),
  frequency: z.nativeEnum(FrequencyValues).optional(),
  amount: z.number().positive('El monto debe ser mayor a 0').optional(),
  description: z.string().min(1, 'La descripción es requerida').optional(),
  dateApplication: z.string().min(1, 'La fecha de solicitud es requerida').optional(),
  dateApproved: z.string().nullable().optional(),
  dateRejected: z.string().nullable().optional(),
  status: z.nativeEnum(StatusLoanApplicationValues).optional(),
  currencyId: z.number().positive('Debes seleccionar una moneda').optional(),
});

export type LoanApplicationInput = z.infer<typeof loanApplicationInputSchema>;
export type LoanApplicationUpdate = z.infer<typeof loanApplicationUpdateSchema>;

export interface LoanApplication {
  loanApplicationId: number;
  customerId: number;
  firstName: string;
  lastName: string;
  dni: string | null;
  frequency: Frequency;
  amount: number;
  description: string;
  dateApplication: string;
  dateApproved: string | null;
  dateRejected: string | null;
  status: StatusLoanApplication;
  currencyId: number | null;
  currencyCode: string | null;
  currencyName: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface LoanApplicationFilters {
  page?: number;
  size?: number;
  dni?: string;
  currencyId?: number;
}
