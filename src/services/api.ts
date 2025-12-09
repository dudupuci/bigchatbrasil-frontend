import { getAuthHeaders } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

/**
 * Helper para fazer requisições autenticadas à API
 * Exemplo de uso:
 * 
 * const data = await apiRequest('/users/me', { method: 'GET' });
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro na requisição: ${response.status}`);
  }

  // Se a resposta não tiver conteúdo, retorna null
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  return response.json();
};

// Exemplos de uso para outras funcionalidades:

/**
 * Buscar perfil do usuário
 */
export const getUserProfile = async () => {
  return apiRequest('/users/me', { method: 'GET' });
};

/**
 * Enviar mensagem
 */
export const sendMessage = async (chatId: string, message: string) => {
  return apiRequest(`/chats/${chatId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};

/**
 * Buscar conversas
 */
export const getChats = async () => {
  return apiRequest('/chats', { method: 'GET' });
};
