import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TipsScreen from '../screens/TipsScreen';
import TipsReadingScreen from '../screens/TipsReadingScreen';

const Stack = createNativeStackNavigator();

export default function TipsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TipsHome" component={TipsScreen} />
      <Stack.Screen name="TipsReading" component={TipsReadingScreen} />
    </Stack.Navigator>
  );
}