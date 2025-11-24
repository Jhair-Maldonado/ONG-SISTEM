import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../interfaces/types';

interface AuthContextType {
  user: Usuario | null;
  login: (correo: string, pass: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);
const MOCK_ADMIN: Usuario = {
  id_usuario: 1,
  nombre: 'Jhair',
  apellido: 'Maldonado',
  correo: 'admin@ong.com',
  rol: 'ADMIN'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const storedUser = localStorage.getItem('ong_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (correo: string, pass: string) => {
    if (correo === 'admin@ong.com' && pass === '123456') {
      setUser(MOCK_ADMIN);
      localStorage.setItem('ong_user', JSON.stringify(MOCK_ADMIN));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ong_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
