// src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import accountService from '../services/accountService';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Agrega otros campos del response Según la API
}

type UseLoginResult = ReturnType<typeof useMutation<LoginResponse, Error, LoginCredentials>> & {
  // Agrega otros campos del response Según la API
};

const useLogin = (): UseLoginResult => {
  return useMutation<LoginResponse, Error, LoginCredentials>(
    async (credentials: LoginCredentials) => await accountService.login(credentials),
    {
      onSuccess: (data: LoginResponse) => {
        // Aquí puedes manejar la lógica de éxito, como redirigir al usuario o almacenar el token.
        console.log('Login successful:', data);
      },
      onError: (error: Error) => {
        // Manejas los errores aquí
        console.error('Login failed:', error);
      }
    }
  );
};

export default useLogin;