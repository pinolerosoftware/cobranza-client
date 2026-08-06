import { z } from 'zod';

export const loginSchema = z.object({
  userName: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  userName: string;
  role: string;
  name: string;
  email: string;
  tenantId: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface JwtPayload {
  UserId: string;
  UserName: string;
  Email: string;
  Role: string;
  TenantId: string;
  exp: number;
  iss: string;
  aud: string;
}

export function decodeJwtToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
