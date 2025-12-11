import { LoginRequest, AuthApiResponse, CriarClienteRequest, CriarEmpresaRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

export const authService = {
  login: async (loginRequest: LoginRequest): Promise<AuthApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao realizar login');
    }

    const data: AuthApiResponse = await response.json();
    return data;
  },

  registrarCliente: async (clienteData: CriarClienteRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/registrar/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao realizar cadastro');
    }
  },

  registrarEmpresa: async (empresaData: CriarEmpresaRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/registrar/empresa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empresaData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao realizar cadastro');
    }
  },
};

export const getSessionId = (): string | null => {
  return sessionStorage.getItem('@bcb:sessionId');
};

export const setSessionId = (sessionId: string): void => {
  sessionStorage.setItem('@bcb:sessionId', sessionId);
};

export const removeSessionId = (): void => {
  sessionStorage.removeItem('@bcb:sessionId');
};

export const getAuthHeaders = (): HeadersInit => {
  const sessionId = getSessionId();
  if (sessionId) {
    return {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId,
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};
