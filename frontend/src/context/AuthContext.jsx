import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.verifyToken();
          setUser(response.data.user);
        } catch (error) {
          sessionStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      sessionStorage.setItem('authToken', token);
      setUser(user);

      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVoter: user?.role === 'voter'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};