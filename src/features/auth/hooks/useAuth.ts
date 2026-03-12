import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { accountService } from '@/services/accountService';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

/**
 * Hook to handle login for all roles
 * Includes token storage and user data management
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => accountService.login(credentials),
    onSuccess: (data: LoginResponse) => {
      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update global user state in Query Cache
      queryClient.setQueryData(['currentUser'], data.user);
      
      // Redirect based on role or to dashboard
      navigate({ to: '/' });
    },
    onError: (error: any) => {
      // Errors can be handled by the UI using the mutation state
      console.error('Login error:', error.response?.data || error.message);
    },
  });
};

/**
 * Hook to handle logout
 */
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
