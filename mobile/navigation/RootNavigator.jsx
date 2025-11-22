// navigation/RootNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';
import BottomNav from './BottomNav';
import AuthStack from './AuthStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootNavigator() {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Optional: add a splash screen later
    return null;
  }
  
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <BottomNav /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}