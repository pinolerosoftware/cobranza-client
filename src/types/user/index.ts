import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  userName: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  companyId: z.string().min(1, 'La empresa es requerida'),
  role: z.enum(['Admin', 'Cobrador']),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userName: z.string(),
  role: z.enum(['Admin', 'Cobrador']),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  companyId: z.string(),
  active: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const paginatedUsersSchema = z.object({
  content: z.array(userResponseSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;

export type UserRole = 'Admin' | 'Cobrador';
