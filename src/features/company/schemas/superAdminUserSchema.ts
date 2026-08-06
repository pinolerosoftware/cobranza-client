import { z } from 'zod';

export const superAdminUserSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  userName: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres').optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  companyId: z.number({ message: 'La empresa es requerida' }).int().positive('La empresa es requerida'),
  role: z.string().min(1, 'El rol es requerido'),
  active: z.boolean(),
});

export type SuperAdminUserFormValues = z.infer<typeof superAdminUserSchema>;
