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
    // Recuperar dados do localStorage ao inicializar
    const storedUser = localStorage.getItem('@bcb:user');
    const storedSessionId = localStorage.getItem('@bcb:sessionId');
    
    if (storedUser && storedSessionId) {
      setUser(JSON.parse(storedUser));
      setSessionId(storedSessionId);
    }
  }, []);

  const login = (userData: User, userSessionId: string) => {
    setUser(userData);
    setSessionId(userSessionId);
    localStorage.setItem('@bcb:user', JSON.stringify(userData));
    localStorage.setItem('@bcb:sessionId', userSessionId);
  };

  const logout = () => {
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('@bcb:user');
    removeSessionId();
  };

  const getSessionId = () => {
    return sessionId || localStorage.getItem('@bcb:sessionId');
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
