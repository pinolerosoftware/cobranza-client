import { z } from 'zod';

export const companyInputSchema = z.object({
  companyId: z.number().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  identifier: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

export const companyResponseSchema = companyInputSchema.extend({
  companyId: z.number(),
});

export type CompanyInput = z.infer<typeof companyInputSchema>;
export type CompanyResponse = z.infer<typeof companyResponseSchema>;

export interface CompanyFilters {
  page?: number;
  size?: number;
}
