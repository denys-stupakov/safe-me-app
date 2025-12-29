// stacks/TestStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TestScreen from '../screens/TestScreen';
import TestTakingScreen from '../screens/TestTakingScreen';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createNativeStackNavigator();

export default function TestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TestHome" component={TestScreen} />
      <Stack.Screen name="TestTaking" component={TestTakingScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}