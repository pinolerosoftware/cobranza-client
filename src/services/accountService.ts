import api from './api';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

class AccountService {
  /**
   * Login for all roles (Superadmin, Admin, Cobrador)
   * All roles share the same /account/login endpoint
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/account/login', credentials);
    return response.data;
  }

  /**
   * Logout handles local cleanup
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user from local storage
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const accountService = new AccountService();
export default accountService;
