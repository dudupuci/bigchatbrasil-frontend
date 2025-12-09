import { apiRequest } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'CLIENTE' | 'EMPRESA';
}

export interface Conversa {
  conversaId: string;
  outroUsuarioId: number;
  outroUsuarioNome: string;
  outroUsuarioTipo: 'CLIENTE' | 'EMPRESA';
  ultimaMensagem: string;
  ultimaMensagemDataHora: string;
  mensagensNaoLidas: number;
}

export interface Mensagem {
  id: number;
  conversaId: string;
  remetenteId: number;
  destinatarioId: number;
  conteudo: string;
  status: string;
  momentoEnvio: string;
}

export interface EnviarMensagemRequest {
  conversaId?: string;
  destinatarioId: number;
  tipoDestinatario: 'CLIENTE' | 'EMPRESA';
  conteudo: string;
  tipo: 'EMAIL' | 'SMS' | 'CHAT_ONLINE';
  prioridade: 'NENHUMA' | 'BAIXA' | 'ALTA';
}

/**
 * Busca usuário (Cliente ou Empresa) por email
 */
export const buscarUsuarioPorEmail = async (email: string): Promise<Usuario> => {
  return apiRequest(`/usuarios/buscar-por-email?email=${encodeURIComponent(email)}`, {
    method: 'GET',
  });
};

/**
 * Lista todas as conversas do usuário logado
 */
export const listarConversas = async (): Promise<{ conversas: Conversa[]; total: number }> => {
  return apiRequest('/mensagens/conversas', {
    method: 'GET',
  });
};

/**
 * Lista mensagens de uma conversa específica
 */
export const listarMensagensDaConversa = async (conversaId: string): Promise<{ mensagens: Mensagem[]; total: number }> => {
  return apiRequest(`/mensagens/conversa/${conversaId}`, {
    method: 'GET',
  });
};

/**
 * Envia uma mensagem
 */
export const enviarMensagem = async (dados: EnviarMensagemRequest): Promise<any> => {
  return apiRequest('/mensagens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  });
};

