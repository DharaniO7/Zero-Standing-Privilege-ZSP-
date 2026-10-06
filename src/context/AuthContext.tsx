import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load stored token & user on load
    const storedToken = localStorage.getItem('zsp_jwt_token');
    const storedUser = localStorage.getItem('zsp_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('zsp_jwt_token');
        localStorage.removeItem('zsp_user');
      }
    } else {
      // Default initial user for demo preview if not logged in
      const defaultUser: User = {
        id: 'EMP001',
        username: 'admin',
        name: 'Sarah Jenkins (SecAdmin)',
        role: 'Security Officer',
        accountType: 'Admin',
        department: 'Cybersecurity Operations',
      };
      setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string = 'password123'): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Login failed');
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);

      localStorage.setItem('zsp_jwt_token', data.token);
      localStorage.setItem('zsp_user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('zsp_jwt_token');
    localStorage.removeItem('zsp_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
