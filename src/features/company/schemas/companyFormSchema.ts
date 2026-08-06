import { z } from 'zod';

export const companyFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  identifier: z.string().optional().or(z.literal('')),
  active: z.boolean(),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
