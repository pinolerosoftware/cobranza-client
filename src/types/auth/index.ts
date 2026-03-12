import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  username: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'COBRADOR';
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
