import api from './api';
import type { ApiResponse } from '@/types/api';
import type { Currency } from '@/types/currency';
import { toCamelCaseKeys } from '@/lib/casing';

class CurrencyService {
  async getAll(): Promise<Currency[]> {
    const response = await api.get<ApiResponse<Currency[]>>('/Currency');
    return toCamelCaseKeys(response.data || []) as unknown as Currency[];
  }

  async getById(id: number): Promise<Currency> {
    const response = await api.get<ApiResponse<Currency>>(`/Currency/${id}`);
    return toCamelCaseKeys(response.data) as unknown as Currency;
  }
}

export const currencyService = new CurrencyService();
export default currencyService;
