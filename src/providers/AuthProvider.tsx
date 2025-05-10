import { createContext, useEffect, useState } from "react";
import { User, Token } from "../types/auth";
import { api } from "../api/axios";
import { RegisterDto } from "../schemas/auth";
import { authApi } from "../api/auth";

type AuthContextType = {
  user: User | null;
  isLoading: boolean
  login: (tokens: Token) => Promise<void>;
  logout: () => void;
  registerContext: (registerData: RegisterDto) => Promise<void>;
  handle2FASetup: (token: string, secret?: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (tokens: Token) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    // Fetch user profile
    const { data } = await api.get('/auth/me');
    console.log('User profile fetched: ', data);
    setUser(data); // Triggers re-render
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

  const handle2FASetup = async (token: string) => {
    try {
      await authApi.verify2FA(token);
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      throw new Error('2FA verification failed')
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

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      registerContext,
      handle2FASetup
      }}>
      {children}
    </AuthContext.Provider>
  );
};
