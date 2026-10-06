export interface User {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreationAttributes {
  nome: string;
  email: string;
  senha_hash: string;
}

export interface UserUpdateAttributes {
  nome?: string;
  email?: string;
  senha_hash?: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
