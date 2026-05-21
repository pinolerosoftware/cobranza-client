import api from './api';
import type { LoginCredentials, LoginResponse } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

class AccountService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>('/Account/Login', credentials);
    return response.data.data;
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
