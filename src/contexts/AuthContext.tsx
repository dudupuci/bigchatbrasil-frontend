import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { removeSessionId } from '../services/authService';

interface AuthContextData {
  user: User | null;
  sessionId: string | null;
  login: (user: User, sessionId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getSessionId: () => string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar dados do sessionStorage (isolado por aba) ao inicializar
    const storedUser = sessionStorage.getItem('@bcb:user');
    const storedSessionId = sessionStorage.getItem('@bcb:sessionId');

    if (storedUser && storedSessionId) {
      setUser(JSON.parse(storedUser));
      setSessionId(storedSessionId);
    }
  }, []);

  const login = (userData: User, userSessionId: string) => {
    setUser(userData);
    setSessionId(userSessionId);
    // Usa sessionStorage para isolar entre abas
    sessionStorage.setItem('@bcb:user', JSON.stringify(userData));
    sessionStorage.setItem('@bcb:sessionId', userSessionId);
  };

  const logout = () => {
    setUser(null);
    setSessionId(null);
    sessionStorage.removeItem('@bcb:user');
    removeSessionId();
  };

  const getSessionId = () => {
    return sessionId || sessionStorage.getItem('@bcb:sessionId');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        login,
        logout,
        isAuthenticated: !!user,
        getSessionId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
