import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-27ffc17a`;

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem('aww_access_token');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Check for admin token
      if (storedToken === 'admin-token-local') {
        const adminUserStr = localStorage.getItem('aww_admin_user');
        if (adminUserStr) {
          setUser(JSON.parse(adminUserStr));
          setAccessToken(storedToken);
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await fetch(`${baseUrl}/session`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAccessToken(storedToken);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('aww_access_token');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('aww_access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check for hardcoded admin credentials first
      if (email === 'admin@aww.com' && password === 'AWW2025!Admin') {
        const adminUser = {
          id: 'admin-001',
          email: 'admin@aww.com',
          firstName: 'Admin',
          lastName: 'User'
        };
        setUser(adminUser);
        setAccessToken('admin-token-local');
        localStorage.setItem('aww_access_token', 'admin-token-local');
        localStorage.setItem('aww_admin_user', JSON.stringify(adminUser));
        return;
      }

      const response = await fetch(`${baseUrl}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign in failed');
      }

      setUser(data.user);
      setAccessToken(data.accessToken);
      localStorage.setItem('aww_access_token', data.accessToken);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      // If we got an access token, set the user (auto sign-in)
      if (data.accessToken) {
        setUser(data.user);
        setAccessToken(data.accessToken);
        localStorage.setItem('aww_access_token', data.accessToken);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Don't try to call API for admin logout
      if (accessToken !== 'admin-token-local' && accessToken) {
        await fetch(`${baseUrl}/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('aww_access_token');
      localStorage.removeItem('aww_admin_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
