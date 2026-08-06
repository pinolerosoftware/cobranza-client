import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { accountService } from '@/services/accountService';
import { decodeJwtToken } from '@/types/auth';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => accountService.login(credentials),
    onSuccess: (data: LoginResponse) => {
      const payload = decodeJwtToken(data.token);
      if (!payload) {
        console.error('Failed to decode JWT token');
        return;
      }

      const user = {
        id: payload.UserId,
        userName: payload.UserName,
        email: payload.Email,
        role: payload.Role,
        tenantId: parseInt(payload.TenantId, 10),
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      queryClient.setQueryData(['currentUser'], user);

      const isSuperAdmin = user.role === 'SuperAdmin';
      navigate({ to: isSuperAdmin ? '/superadmin' : '/' });

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
