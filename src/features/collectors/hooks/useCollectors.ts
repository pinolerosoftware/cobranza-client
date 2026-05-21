import { useUsers } from '@/features/users/hooks/useUsers';
import type { UserFilters } from '@/types/user';

export const COLLECTOR_ROLE = 'Cobrador';

export const useCollectors = (filters: Omit<UserFilters, 'role'> = {}) => {
  return useUsers({ ...filters, role: COLLECTOR_ROLE });
};
