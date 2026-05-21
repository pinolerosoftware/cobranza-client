import api from './api';
import type { ApiResponse } from '@/types/api';
import type { Currency } from '@/types/currency';

class CurrencyService {
  async getAll(): Promise<Currency[]> {
    const response = await api.get<ApiResponse<Currency[]>>('/Currency');
    return response.data.data;
  }

  async getById(id: number): Promise<Currency> {
    const response = await api.get<ApiResponse<Currency>>(`/Currency/${id}`);
    return response.data.data;
  }
}

export const currencyService = new CurrencyService();
export default currencyService;
