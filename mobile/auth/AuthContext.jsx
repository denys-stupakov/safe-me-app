import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log('Auth load failed', e);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);
  
  const login = async (userData, jwtToken) => {
    await AsyncStorage.setItem('jwtToken', jwtToken);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(jwtToken);
  };
  
  const logout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};