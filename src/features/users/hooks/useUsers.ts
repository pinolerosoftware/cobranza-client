import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import type { CreateUserDTO, UpdateUserDTO, DeleteUserDTO, UserFilters } from '@/types/user';

export const USER_QUERY_KEY = 'users';

export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      if (filters.role) {
        return {
          ...data,
          content: data.content.filter((user) => user.role === filters.role),
        };
      }
      return data;
    },
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
    mutationFn: (data: DeleteUserDTO) => userService.deleteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};
