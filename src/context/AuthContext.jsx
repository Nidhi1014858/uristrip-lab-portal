import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const u = await mockApi.getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const u = await mockApi.login(email, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const u = await mockApi.signup(userData);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await mockApi.logout();
    setUser(null);
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
    const updated = await mockApi.updateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return;
    const updated = await mockApi.changePassword(user.id, currentPassword, newPassword);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserProfile,
        changePassword,
        isTechnician: user?.role === 'Technician',
        isClinician: user?.role === 'Clinician'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
