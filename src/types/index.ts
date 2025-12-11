export enum TipoUsuario {
  CLIENTE = 'CLIENTE',
  EMPRESA = 'EMPRESA',
}

export interface LoginRequest {
  email: string;
  senha: string;
  tipo: TipoUsuario;
}

export interface AuthApiResponse {
  sessionId: string;
  id: string; // UUID
  nome: string;
  email: string;
  tipo: 'CLIENTE' | 'EMPRESA';
}

export interface User {
  id: string; // UUID
  nome: string;
  email: string;
  tipo: 'CLIENTE' | 'EMPRESA';
}

export interface CriarClienteRequest {
  nome: string;
  sobrenome: string;
  sexo: string;
  email: string;
  cpf_cnpj: string;
  senha: string;
  confirmacao_senha: string;
  telefone: string;
  sobre: string;
}

export interface CriarEmpresaRequest {
  razao_social: string;
  cnpj: string;
  telefone: string;
  email: string;
  senha: string;
  confirmacao_senha: string;
}
