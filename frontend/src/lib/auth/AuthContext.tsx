import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearLoginSession } from '../api/client';
import type { Role, User } from '../../types/domain';

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): User | null {
  const raw = localStorage.getItem('constancias_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(readStoredUser);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    setUser(nextUser) {
      setUserState(nextUser);
      if (nextUser) localStorage.setItem('constancias_user', JSON.stringify(nextUser));
      else localStorage.removeItem('constancias_user');
    },
    logout() {
      clearLoginSession();
      setUserState(null);
    },
    hasRole(...roles) {
      return Boolean(user && roles.includes(user.role));
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

