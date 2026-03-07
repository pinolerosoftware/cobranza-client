// src/services/accountService.ts
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Agrega otros campos del response según la API
}

class AccountService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post('/account/login', credentials);
    return response.data as LoginResponse;
  }
}

export default new AccountService();