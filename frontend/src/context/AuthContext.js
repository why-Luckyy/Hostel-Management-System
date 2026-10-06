import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { getErrorMessage } from '../api/client';
import { saveToken, saveUser, getToken, getUser, clearAuth } from '../api/storage';

// 1. Create Context
export const AuthContext = createContext();

/**
 * AuthProvider component
 * Manages global authentication state: token, user info, and role.
 * Restores the user session automatically on app launch from SecureStore.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = await getToken();
        const savedUser = await getUser();

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login function calling POST /api/auth/login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token: receivedToken, user: receivedUser } = response.data;

      // Save to device secure storage
      await saveToken(receivedToken);
      await saveUser(receivedUser);

      // Update React state
      setToken(receivedToken);
      setUser(receivedUser);

      return { success: true, user: receivedUser };
    } catch (error) {
      const message = getErrorMessage(error);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await clearAuth();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        role: user?.role || null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth in components easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
