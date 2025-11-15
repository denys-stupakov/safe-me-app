import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ToolsScreen from '../screens/ToolsScreen';
import PasswordGenerator from '../screens/PasswordGenerator';
import PasswordValidator from '../screens/PasswordValidator';

const Stack = createNativeStackNavigator();

export default function ToolsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ToolsHome" component={ToolsScreen} />
      <Stack.Screen name="PasswordGenerator" component={PasswordGenerator} />
      <Stack.Screen name="PasswordValidator" component={PasswordValidator} />
    </Stack.Navigator>
  );
}