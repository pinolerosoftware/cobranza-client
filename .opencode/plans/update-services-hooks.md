# Plan de Actualización: Servicios, Interfaces y Hooks

## Resumen
Actualizar los servicios, interfaces y hooks existentes para que coincidan exactamente con los endpoints del backend proporcionados.

---

## 1. `src/types/auth/index.ts`

### Cambios necesarios:
- Cambiar `username` por `userName` en `loginSchema` (el backend espera `userName`)
- Cambiar `username` por `userName` en la interfaz `User`

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  userName: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  userName: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'COBRADOR';
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
```

---

## 2. `src/types/user/index.ts`

### Cambios necesarios:
- Reemplazar `companyId` por `tenantId` (el backend usa `tenantId`)
- Ajustar schemas para coincidir con los campos exactos del backend

```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  userName: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  tenantId: z.number().nullable().optional(),
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
  tenantId: z.number().nullable().optional(),
  active: z.boolean().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
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
  tenantId: number | null | undefined;
  active?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UserRole = string;

export interface UserFilters {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  active?: boolean;
}

export interface PaginatedUsers {
  content: UserResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
```

---

## 3. `src/types/loan-application/index.ts`

### Cambios necesarios:
- Eliminar `companyId` de los schemas (no está en el backend)

```typescript
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
```

---

## 4. `src/types/customer/customer.dto.ts`

### Cambios necesarios:
- Alinear con los campos exactos del backend

```typescript
export interface Customer {
  customerId?: number;
  firstName: string;
  lastName: string;
  dni?: string | null;
  passport?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  active: boolean;
}

export interface CreateCustomerDTO {
  firstName?: string;
  lastName?: string;
  dni?: string | null;
  passport?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  active?: boolean;
}

export interface UpdateCustomerDTO {
  customerId?: number;
  firstName?: string;
  lastName?: string;
  dni?: string | null;
  passport?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
  active?: boolean;
}
```

---

## 5. `src/services/accountService.ts`

### Cambios necesarios:
- Ajustar para manejar la respuesta del backend correctamente

```typescript
import api from './api';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

class AccountService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/Account/Login', credentials);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const accountService = new AccountService();
export default accountService;
```

---

## 6. `src/services/userService.ts`

### Cambios necesarios:
- Ajustar endpoints para coincidir con el backend (sin ID en path para POST/PUT/DELETE)
- Usar `tenantId` en lugar de `companyId`
- Ajustar respuesta paginada

```typescript
import api from '@/services/api';
import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponse,
  PaginatedUsers,
  UserFilters,
} from '@/types/user';
import type { ApiResponse } from '@/types/api';

class UserService {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
    const { page = 1, size = 10 } = filters;
    const response = await api.get<ApiResponse<UserResponse[]>>('/User', {
      params: { page, size },
    });

    return {
      content: response.data.data || [],
      totalElements: response.data.data?.length || 0,
      totalPages: Math.ceil((response.data.data?.length || 0) / size),
      size,
      number: page,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const response = await api.post<ApiResponse<UserResponse>>('/User', data);
    return response.data.data;
  }

  async updateUser(data: UpdateUserDTO): Promise<UserResponse> {
    const response = await api.put<ApiResponse<UserResponse>>('/User', data);
    return response.data.data;
  }

  async deleteUser(data: UpdateUserDTO): Promise<void> {
    await api.delete('/User', { data });
  }
}

export const userService = new UserService();
export default userService;
```

---

## 7. `src/services/customerService.ts`

### Cambios necesarios:
- Simplificar para alinearse con el backend

```typescript
import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/types/customer';

class CustomerService {
  async getAll(page: number = 1, size: number = 10): Promise<PaginatedResponse<Customer>> {
    const response = await api.get<ApiResponse<Customer[]>>('/Customer', { params: { page, size } });

    return {
      content: response.data.data || [],
      totalElements: response.data.data?.length || 0,
      totalPages: Math.ceil((response.data.data?.length || 0) / size),
      size,
      number: page,
    };
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    const response = await api.post<ApiResponse<Customer>>('/Customer', data);
    return response.data.data;
  }

  async update(data: UpdateCustomerDTO): Promise<Customer> {
    const response = await api.put<ApiResponse<Customer>>('/Customer', data);
    return response.data.data;
  }

  async delete(data: UpdateCustomerDTO): Promise<void> {
    await api.delete('/Customer', { data });
  }
}

export const customerService = new CustomerService();
export default customerService;
```

---

## 8. `src/services/loanApplicationService.ts`

### Cambios necesarios:
- Eliminar `companyId` de la interfaz de respuesta

```typescript
import api from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { LoanApplicationInput, LoanApplicationUpdate, LoanApplicationFilters } from '@/types/loan-application';

interface LoanApplicationResponse {
  loanApplicationId: number;
  customerId: number;
  frequency: number;
  amount: number;
  description: string;
  dateApplication: string;
  dateApproved: string | null;
  dateRejected: string | null;
  status: number;
  currencyId: number;
  active: boolean;
}

class LoanApplicationService {
  async getAll(filters: LoanApplicationFilters = {}): Promise<PaginatedResponse<LoanApplicationResponse>> {
    const { Page = 1, Size = 10, Dni, CurrencyId } = filters;
    const params: Record<string, string | number> = { Page, Size };
    if (Dni) params.Dni = Dni;
    if (CurrencyId) params.CurrencyId = CurrencyId;

    const response = await api.get<ApiResponse<LoanApplicationResponse[]>>('/LoanApplication', { params });

    return {
      content: response.data.data || [],
      totalElements: response.data.data?.length || 0,
      totalPages: Math.ceil((response.data.data?.length || 0) / Size),
      size: Size,
      number: Page,
    };
  }

  async create(data: LoanApplicationInput): Promise<LoanApplicationResponse> {
    const response = await api.post<ApiResponse<LoanApplicationResponse>>('/LoanApplication', data);
    return response.data.data;
  }

  async update(data: LoanApplicationUpdate): Promise<LoanApplicationResponse> {
    const response = await api.put<ApiResponse<LoanApplicationResponse>>('/LoanApplication', data);
    return response.data.data;
  }

  async delete(data: LoanApplicationInput): Promise<void> {
    await api.delete('/LoanApplication', { data });
  }
}

export const loanApplicationService = new LoanApplicationService();
export default loanApplicationService;
```

---

## 9. `src/features/users/hooks/useUsers.ts`

### Cambios necesarios:
- Ajustar para reflejar los cambios del servicio

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import type { CreateUserDTO, UpdateUserDTO, UserFilters } from '@/types/user';

export const USER_QUERY_KEY = 'users';

export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDTO) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDTO) => userService.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDTO) => userService.deleteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};
```

---

## 10. `src/features/customers/hooks/useCustomers.ts`

### Cambios necesarios:
- Ajustar para reflejar los cambios del servicio

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import type { Customer, UpdateCustomerDTO } from '@/types/customer';

export const CUSTOMER_QUERY_KEY = 'customers';

export const useCustomers = (page: number = 1, size: number = 10) => {
  return useQuery({
    queryKey: [CUSTOMER_QUERY_KEY, page, size],
    queryFn: () => customerService.getAll(page, size),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof customerService.create>[0]) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerDTO) => customerService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCustomerDTO) => customerService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
    },
  });
};
```

---

## 11. `src/features/auth/hooks/useAuth.ts`

### Cambios necesarios:
- Ajustar para usar `userName` en lugar de `username`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { accountService } from '@/services/accountService';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => accountService.login(credentials),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['currentUser'], data.user);
      navigate({ to: '/' });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    accountService.logout();
    queryClient.setQueryData(['currentUser'], null);
    queryClient.clear();
    navigate({ to: '/login' });
  };
};
```

---

## 12. `src/features/loan-application/hooks/useLoanApplication.ts`

### Cambios necesarios:
- No requiere cambios mayores, solo asegurar consistencia

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loanApplicationService } from '@/services/loanApplicationService';
import type { LoanApplicationInput, LoanApplicationUpdate, LoanApplicationFilters } from '@/types/loan-application';

export const LOAN_APPLICATION_QUERY_KEY = 'loan-applications';

export const useLoanApplications = (filters: LoanApplicationFilters = {}) => {
  return useQuery({
    queryKey: [LOAN_APPLICATION_QUERY_KEY, filters],
    queryFn: () => loanApplicationService.getAll(filters),
  });
};

export const useCreateLoanApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationInput) => loanApplicationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOAN_APPLICATION_QUERY_KEY] });
    },
  });
};

export const useUpdateLoanApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationUpdate) => loanApplicationService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOAN_APPLICATION_QUERY_KEY] });
    },
  });
};

export const useDeleteLoanApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoanApplicationInput) => loanApplicationService.delete(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOAN_APPLICATION_QUERY_KEY] });
    },
  });
};
```

---

## Archivos que NO requieren cambios

- `src/services/companyService.ts` - Ya coincide con el backend
- `src/types/company/index.ts` - Ya coincide con el backend
- `src/services/currencyService.ts` - Ya coincide con el backend
- `src/types/currency/index.ts` - Ya coincide con el backend
- `src/features/company/hooks/useCompany.ts` - Ya está correcto
- `src/features/currency/hooks/useCurrency.ts` - Ya está correcto
- `src/features/collectors/hooks/useCollectors.ts` - Ya está correcto (usa useUsers)
- `src/types/api.ts` - Ya está correcto

---

## Resumen de archivos a modificar

| Archivo | Cambio principal |
|---------|-----------------|
| `src/types/auth/index.ts` | `username` → `userName` |
| `src/types/user/index.ts` | `companyId` → `tenantId`, eliminar campos no usados |
| `src/types/loan-application/index.ts` | Eliminar `companyId` |
| `src/types/customer/customer.dto.ts` | Agregar `CreateCustomerDTO` y `UpdateCustomerDTO` |
| `src/services/accountService.ts` | Simplificar respuesta |
| `src/services/userService.ts` | Ajustar endpoints sin ID en path |
| `src/services/customerService.ts` | Simplificar y alinear con backend |
| `src/services/loanApplicationService.ts` | Eliminar `companyId` |
| `src/features/users/hooks/useUsers.ts` | Ajustar mutationFn |
| `src/features/customers/hooks/useCustomers.ts` | Ajustar mutationFn |
| `src/features/auth/hooks/useAuth.ts` | Usar `userName` |
