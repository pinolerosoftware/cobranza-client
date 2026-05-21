import api from '@/services/api';
import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponse,
  PaginatedUsers,
  UserFilters,
} from '@/types/user';

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

    const response = await api.get<unknown>(`/User?${params.toString()}`);
    const data = response.data as Record<string, unknown>;
    
    const content = (data.data as UserResponse[]) || [];
    return {
      content,
      totalElements: data.rowCount as number || content.length,
      totalPages: Math.ceil((data.rowCount as number || content.length) / size),
      size,
      number: page,
    };
  }

  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/User/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const response = await api.post<UserResponse>('/User', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/User/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/User/${id}`);
  }

  async toggleUserStatus(id: string, active: boolean): Promise<UserResponse> {
    const response = await api.patch<UserResponse>(`/User/${id}/status`, { active });
    return response.data;
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    await api.patch(`/User/${id}/password`, { password: newPassword });
  }
}

export const userService = new UserService();
export default userService;
