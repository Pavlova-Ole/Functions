import { useState, useCallback } from 'react';
import { authApi } from './api/authApi';

export function useAuth() {
  const [user, setUser] = useState(authApi.getUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    const result = await authApi.register(userData);
    if (result.success) setUser(result.data.user);
    else setError(result.error);
    setIsLoading(false);
    return result;
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    const result = await authApi.login(credentials);
    if (result.success) setUser(result.data.user);
    else setError(result.error);
    setIsLoading(false);
    return result;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };
}