import api from '@/services/api';
import type { 
  CreateUserDTO, 
  UpdateUserDTO, 
  UserResponse, 
  PaginatedUsers 
} from '@/types/user';

interface UserFilters {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  active?: boolean;
}

class UserService {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
    const { page = 1, size = 10, search, role, active } = filters;
    
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (active !== undefined) params.append('active', active.toString());

    const response = await api.get<PaginatedUsers>(`/user?${params.toString()}`);
    return response.data;
  }

  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/user/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/user', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/user/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/user/${id}`);
  }

  async toggleUserStatus(id: string, active: boolean): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(`/user/${id}/status`, { active });
    return response.data;
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    await api.patch(`/user/${id}/password`, { password: newPassword });
  }
}

export const userService = new UserService();
export default userService;
