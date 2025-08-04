import { createContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Token, LoginResponse } from "../types/auth";
import { api } from "../api/axios";
import { RegisterDto } from "../schemas/auth";
import { authApi } from "../api/auth";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  roles?: string[];
}

interface RegisterApiResponse {
  user: User;
  tokens: Token
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean
  login: (loginResponse: LoginResponse) => Promise<void>;
  logout: () => void;
  registerContext: (registerData: RegisterDto) => Promise<RegisterApiResponse>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  userRoles: string[];
};

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to decode token and set user/roles
  const decodeJwtPayload = useCallback((accessToken: string): JwtPayload | null => {
    try {
      const decoded: JwtPayload = jwtDecode(accessToken);
      return decoded;
    } catch (error) {
      console.error("Failed to decode access token:", error);
      // If token decoding fails, clear tokens from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  }, []);

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
        setUserRoles(loginResponse.user.roles || []);
      } else {
        // Fetch user profile
        await refreshUser();
      }
    }
  };

  const logout = useCallback(async () => {
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
      setUserRoles([]);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      setUserRoles(data.roles || []);
      return data;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  }, []);

  const registerContext = async (registerData: RegisterDto) => {
    // Send registration request
    const { data }: { data: RegisterApiResponse } = await api.post('/auth/register', registerData);
    console.log('User registered:', data);

    // Try logging user immediately after registration
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    setUser(data.user); // Triggers re-render
    setUserRoles(data.user.roles || []);

    return data;
  };

  const hasRole = useCallback((role: string): boolean => {
    return userRoles.includes(role);
  }, [userRoles]);

  useEffect(() => {
    const checkAuth = async () => {
      // Keep track if we have a token to check initially
      const hasToken = !!localStorage.getItem('accessToken');
      if (!hasToken) {
        setIsLoading(false) // If no token, then nothing to check, stop loading
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      // First decode jwt to get basic info like user role
      const decodedPayload = decodeJwtPayload(accessToken);
      if (!decodedPayload) {
        setIsLoading(false);
        return;
      }
      
      try {
        await refreshUser();
        console.log('Auth check successful via /auth/me');
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
          setUserRoles(data.user.roles || []);
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
      refreshUser,
      hasRole,
      userRoles,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
