import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('kanban_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('kanban_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kanban_user');
    }
  }, [user]);

  const login = (userData) => {
    console.log('login вызван');
    const user = userData || { email: 'test@example.com' };
    setUser(user);
    return user;
  };

  const logout = () => {
    console.log('logout вызван');
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
}