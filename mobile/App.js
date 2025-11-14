import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApiTestScreen from './screens/ApiTestScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ApiTest" component={ApiTestScreen} options={{ title: 'Test Backend' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}