import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('wms_admin_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('wms_admin_token');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('wms_admin_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (employeeId, password) => {
    const res = await api.post('/auth/login', { employee_id: employeeId, password });
    if (res.success) {
      if (res.data.user.role !== 'admin') {
        throw new Error('Access denied: Admin role required');
      }
      localStorage.setItem('wms_admin_token', res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.message);
  };

  const logout = () => {
    localStorage.removeItem('wms_admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
