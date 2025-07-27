import { createContext, useEffect, useState, ReactNode } from "react";
import { User, Token, LoginResponse } from "../types/auth";
import { api } from "../api/axios";
import { RegisterDto } from "../schemas/auth";
import { authApi } from "../api/auth";

type AuthContextType = {
  user: User | null;
  isLoading: boolean
  login: (loginResponse: LoginResponse) => Promise<void>;
  logout: () => void;
  registerContext: (registerData: RegisterDto) => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (loginResponse: LoginResponse) => {
    // Check if this is a 2FA response (temp token)
    if ('require2FA' in loginResponse && loginResponse.require2FA) {
      // Don't store tokens yet, just return - the 2FA verification will handle token storage
      return;
    }

    // Normal login flow - store tokens and fetch user
    if ('accessToken' in loginResponse && 'refreshToken' in loginResponse) {
      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);

      // If user data is included in the response, use it
      if ('user' in loginResponse && loginResponse.user) {
        setUser(loginResponse.user);
      } else {
        // Fetch user profile
        await refreshUser();
      }
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      return data;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  const registerContext = async (registerData: RegisterDto) => {
    // Send registration request
    const { data } = await api.post('/auth/register', registerData);
    console.log('User registered:', data);

    // Try logging user immediately after registration
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    setUser(data.user); // Triggers re-render

    return data;
  };

  const logout = async () => {
    try {
      // Call logout endpoint if user is authenticated
      if (localStorage.getItem('accessToken')) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Keep track if we have a token to check initially
      const hasToken = !!localStorage.getItem('accessToken');
      if (!hasToken) {
        setIsLoading(false) // If no token, then nothing to check, stop loading
        return;
      }
      
      try {
        console.log('Checking /auth/me...');
        const { data } = await api.get('/auth/me');
        setUser(data);
        console.log('Check successful', data);
      } catch (error) {
        console.log('/auth/me failed, trying refresh...');
        try {
          // Attempt token refresh if initial check fails
          const { data: tokens } = await authApi.refreshToken();
          localStorage.setItem('accessToken', tokens.accessToken);
          // Re-fetch user data after successful refresh
          console.log('Refresh successful, fetching /auth/me again...');
          const { data } = await api.get('/auth/me');
          setUser(data);
          console.log('Second /auth/me check successful:', data);
        } catch (refreshError) {
          console.log('Refresh failed, logging out.');
          // Ensure that logout clears state even if API fails
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      } finally {
        // Crucially, set loading to false after all checks/attempts are done
        console.log('Finished auth check, setting loading false');
        setIsLoading(false);
      }
    };

      checkAuth();
  }, []);

  // useEffect for logout event synchronization
  useEffect(() => {
    const handleLogoutEvent = () => {
      console.log('Received authLogout event from interceptor');
      logout();
    };
    
    window.addEventListener('authLogout', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('authLogout', handleLogoutEvent);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      registerContext,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
