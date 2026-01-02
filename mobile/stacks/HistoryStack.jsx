import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HistoryScreen from '../screens/HistoryScreen';
import PasswordHistoryScreen from '../screens/PasswordHistoryScreen';
import ViewedTipsHistoryScreen from '../screens/ViewedTipsHistoryScreen';
import WrongAnsweredTestsScreen from '../screens/WrongAnsweredTestsScreen';

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryHome" component={HistoryScreen} />
      <Stack.Screen name="PasswordHistory" component={PasswordHistoryScreen} />
      <Stack.Screen name="ViewedTipsHistory" component={ViewedTipsHistoryScreen} />
      <Stack.Screen name="WrongAnsweredTests" component={WrongAnsweredTestsScreen} />
    </Stack.Navigator>
  );
}