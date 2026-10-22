import api from '@/services/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  CreateUserDTO,
  UpdateUserDTO,
  DeleteUserDTO,
  UserResponse,
  UserFilters,
} from '@/types/user';

class UserService {
  private toApiPayload(data: Record<string, unknown>): Record<string, unknown> {
    const payload: Record<string, unknown> = { ...data, active: true };
    for (const key of Object.keys(payload)) {
      if (payload[key] === '') {
        payload[key] = null;
      }
    }
    return payload;
  }

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<UserResponse>> {
    const { page = 1, size = 10, role, companyId } = filters;
    const params: Record<string, string | number> = { page, size };
    if (role) params.role = role;
    if (companyId !== undefined) params.companyId = companyId;

    const response = await api.get<ApiResponse<UserResponse[]>>('/User', params);

    return {
      content: response.data || [],
      totalElements: response.data?.length || 0,
      totalPages: Math.ceil((response.data?.length || 0) / size),
      size,
      number: page,
    };
  }

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    const response = await api.post<ApiResponse<UserResponse>>('/User', this.toApiPayload(data as Record<string, unknown>));
    return response.data;
  }

  async updateUser(data: UpdateUserDTO): Promise<UserResponse> {
    const response = await api.put<ApiResponse<UserResponse>>('/User', this.toApiPayload(data as Record<string, unknown>));
    return response.data;
  }

  async deleteUser(data: DeleteUserDTO): Promise<void> {
    await api.delete('/User', data);
  }
}

export const userService = new UserService();
export default userService;
