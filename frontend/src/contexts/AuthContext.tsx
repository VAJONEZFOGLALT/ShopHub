import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, name?: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<void>;
  setUserData: (data: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token) {
      api.setTokens(token, refreshToken || undefined);

      // In a real app, verify token with backend
      // For now, just assume valid
      const raw = localStorage.getItem('userData');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            setUser(parsed);
          }
        } catch (e) {
          // Token is invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ identifier, password });
      const userData = { id: res.id, email: res.email, username: res.username, name: res.name, role: res.role };
      setUser(userData);
      const serialized = JSON.stringify(userData);
      localStorage.setItem('userData', serialized);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string, name?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register({ email, password, username, name });
      const role = res.role || 'USER';
      const userData = { id: res.id, email: res.email, username: res.username, name: res.name, role };
      setUser(userData);
      const serialized = JSON.stringify(userData);
      localStorage.setItem('userData', serialized);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; email?: string; password?: string }) => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    try {
      const updated = await api.updateUser(user.id, data);
      const userData = {
        id: updated.id,
        email: updated.email,
        username: updated.username,
        name: updated.name,
        role: updated.role,
        avatar: updated.avatar,
      };
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const setUserData = (data: User | null) => {
    setUser(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      localStorage.removeItem('userData');
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    localStorage.removeItem('userData');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, updateProfile, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
