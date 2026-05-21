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
  customerId: z.number(),
  frequency: z.nativeEnum(FrequencyValues),
  amount: z.number(),
  description: z.string(),
  dateApplication: z.string(),
  dateApproved: z.string().nullable().optional(),
  dateRejected: z.string().nullable().optional(),
  status: z.nativeEnum(StatusLoanApplicationValues),
  companyId: z.number(),
  currencyId: z.number(),
  active: z.boolean(),
});

export const loanApplicationUpdateSchema = z.object({
  loanApplicationId: z.number(),
  customerId: z.number().nullable().optional(),
  frequency: z.nativeEnum(FrequencyValues).nullable().optional(),
  amount: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  dateApplication: z.string().nullable().optional(),
  dateApproved: z.string().nullable().optional(),
  dateRejected: z.string().nullable().optional(),
  status: z.nativeEnum(StatusLoanApplicationValues).nullable().optional(),
  companyId: z.number().nullable().optional(),
  currencyId: z.number().nullable().optional(),
  active: z.boolean().nullable().optional(),
});

export type LoanApplicationInput = z.infer<typeof loanApplicationInputSchema>;
export type LoanApplicationUpdate = z.infer<typeof loanApplicationUpdateSchema>;

export interface LoanApplicationFilters {
  Page?: number;
  Size?: number;
  Dni?: string;
  CurrencyId?: number;
}
