// stacks/AuthStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Existing screens
import AccountScreen from '../screens/AccountScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// New screens from Account menu
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SavedTipsScreen from '../screens/SavedTipsScreen';

// HistoryStack (contains History menu + sub-screens)
import HistoryStack from './HistoryStack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Account tab entry point */}
      <Stack.Screen name="Account" component={AccountScreen} />
      
      {/* Auth flows */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* New screens accessible from Account */}
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="SavedTips" component={SavedTipsScreen} />
      
      {/* History menu and its sub-screens */}
      <Stack.Screen name="History" component={HistoryStack} />
    </Stack.Navigator>
  );
}