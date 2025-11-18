// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import API from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-login on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await SecureStore.getItemAsync('access_token');
        if (token) {
          const res = await fetch(API.AUTH_ME, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            await SecureStore.deleteItemAsync('access_token');
          }
        }
      } catch (e) {
        console.log('Auto-login failed', e);
      } finally {
        setLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const login = async (email, password) => {
    const formBody = new URLSearchParams();
    formBody.append('username', email);
    formBody.append('password', password);

    const res = await fetch(API.AUTH_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');

    await SecureStore.setItemAsync('access_token', data.access_token);
    const userRes = await fetch(API.AUTH_ME, {
      headers: { Authorization: `Bearer ${data.access_token}` }
    });
    const userData = await userRes.json();
    setUser(userData);
  };

  const register = async (email, password) => {
    const res = await fetch(API.AUTH_REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }

    // Auto-login after register
    await login(email, password);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};