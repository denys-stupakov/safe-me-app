import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';  // ← THIS IS THE ONLY CHANGE (Expo version)
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import TestStack from '../stacks/TestStack';
import TipsStack from '../stacks/TipsStack';
import ToolsStack from '../stacks/ToolsStack';
import AuthStack from '../stacks/AuthStack';

const Tab = createBottomTabNavigator();

export default function BottomNav() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4, marginTop: 2 },
        tabBarStyle: {
          height: 90 + insets.bottom,
          paddingBottom: 12 + insets.bottom,
          paddingTop: 12,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 10
        },
        tabBarIconStyle: { marginTop: 8 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestStack}
        options={{
          tabBarLabel: 'Test',
          tabBarIcon: ({ color }) => <Ionicons name="help-circle-outline" size={26} color={color} />
        }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsStack}
        options={{
          tabBarLabel: 'Tips',
          tabBarIcon: ({ color }) => <Ionicons name="bulb-outline" size={26} color={color} />
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStack}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({ color }) => <Ionicons name="construct-outline" size={26} color={color} />
        }}
      />
      <Tab.Screen
        name="Account"
        component={AuthStack}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={26} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}