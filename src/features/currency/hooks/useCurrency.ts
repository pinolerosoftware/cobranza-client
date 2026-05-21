import { useQuery } from '@tanstack/react-query';
import { currencyService } from '@/services/currencyService';

export const CURRENCY_QUERY_KEY = 'currencies';

export const useCurrencies = () => {
  return useQuery({
    queryKey: [CURRENCY_QUERY_KEY],
    queryFn: () => currencyService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCurrency = (id: number) => {
  return useQuery({
    queryKey: [CURRENCY_QUERY_KEY, id],
    queryFn: () => currencyService.getById(id),
    enabled: !!id,
  });
};
