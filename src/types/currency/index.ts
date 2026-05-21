import { z } from 'zod';

export const currencySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  decimal: z.number(),
  symbol: z.string(),
  active: z.boolean(),
});

export type Currency = z.infer<typeof currencySchema>;
