import { z } from 'zod';
import { FrequencyValues, InterestTypeValues } from '@/types/loan';

export const loanPreviewFormSchema = z.object({
  customerId: z.number().positive('Debes seleccionar un cliente'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  interestRate: z.number().min(0, 'La tasa no puede ser negativa').max(100, 'La tasa no puede superar el 100%'),
  term: z.number().int().positive('El plazo debe ser mayor a 0'),
  frequency: z.nativeEnum(FrequencyValues),
  interestType: z.nativeEnum(InterestTypeValues),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
});

export type LoanPreviewFormValues = z.infer<typeof loanPreviewFormSchema>;
