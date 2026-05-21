import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  userName: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  companyId: z.number().nullable().optional(),
  role: z.string().min(1, 'El rol es requerido'),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional(),
});

export const userResponseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  firstName: z.string(),
  lastName: z.string(),
  userName: z.string(),
  role: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  companyId: z.number().nullable().optional(),
  companyName: z.string().nullable().optional(),
  active: z.boolean().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
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
export type UserResponse = {
  id: string | number;
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  email: string | null | undefined;
  phone: string | null | undefined;
  companyId: number | null | undefined;
  companyName?: string | null;
  active?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};
export type PaginatedUsers = {
  content: UserResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type UserRole = string;

export interface UserFilters {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  active?: boolean;
}
