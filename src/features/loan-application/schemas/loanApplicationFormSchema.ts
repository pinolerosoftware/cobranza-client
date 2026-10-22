import { z } from 'zod';
import { FrequencyValues, StatusLoanApplicationValues } from '@/types/loan-application';

export const loanApplicationFormSchema = z.object({
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

export type LoanApplicationFormValues = z.infer<typeof loanApplicationFormSchema>;
