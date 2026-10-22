import { z } from 'zod';

export const FrequencyValues = {
  Daily: 1,
  Weekly: 2,
  Biweekly: 3,
  Monthly: 4,
} as const;

export type Frequency = (typeof FrequencyValues)[keyof typeof FrequencyValues];

export const InterestTypeValues = {
  Simple: 1,
  Compound: 2,
} as const;

export type InterestType = (typeof InterestTypeValues)[keyof typeof InterestTypeValues];

export const LoanStatusValues = {
  Draft: 0,
  Active: 1,
  Paid: 2,
  Cancelled: 3,
} as const;

export type LoanStatus = (typeof LoanStatusValues)[keyof typeof LoanStatusValues];

export const loanInstallmentPreviewSchema = z.object({
  id: z.number(),
  loanId: z.number(),
  number: z.number(),
  dueDate: z.string(),
  amount: z.number(),
  interest: z.number(),
  capital: z.number(),
  remainingBalance: z.number(),
  isPaid: z.boolean(),
});

export const loanPreviewSchema = z.object({
  id: z.number(),
  loanApplicationId: z.number(),
  amount: z.number(),
  interestRate: z.number(),
  term: z.number(),
  totalInterest: z.number(),
  total: z.number(),
  frequency: z.nativeEnum(FrequencyValues),
  interestType: z.nativeEnum(InterestTypeValues),
  startDate: z.string(),
  installments: z.array(loanInstallmentPreviewSchema),
});

export const loanPreviewInputSchema = z.object({
  id: z.number().default(0),
  loanApplicationId: z.number().default(0),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  interestRate: z.number().min(0, 'La tasa no puede ser negativa').max(100, 'La tasa no puede superar el 100%'),
  term: z.number().int().positive('El plazo debe ser mayor a 0'),
  frequency: z.nativeEnum(FrequencyValues),
  interestType: z.nativeEnum(InterestTypeValues),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  installments: z.array(loanInstallmentPreviewSchema).default([]),
});

export type LoanInstallmentPreview = z.infer<typeof loanInstallmentPreviewSchema>;
export type LoanPreview = z.infer<typeof loanPreviewSchema>;
export type LoanPreviewInput = z.infer<typeof loanPreviewInputSchema>;

export interface LoanItem {
  id: number;
  loanApplicationId: number;
  customerId: number;
  customerName: string;
  amount: number;
  interestRate: number;
  term: number;
  frequency: Frequency;
  interestType: InterestType;
  startDate: string;
  status: LoanStatus;
  installments: LoanInstallmentPreview[];
  createdAt: string;
}
