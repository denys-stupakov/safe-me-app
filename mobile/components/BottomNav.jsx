import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TestScreen from '../screens/TestScreen';
import TipsScreen from '../screens/TipsScreen';
import ToolsStack from '../stacks/ToolsStack';

const Tab = createBottomTabNavigator();

export default function BottomNav({ HomeScreen }) {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
          marginTop: 2,
        },
        tabBarStyle: {
          height: 90 + insets.bottom,
          paddingBottom: 12 + insets.bottom,
          paddingTop: 12,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarLabel: 'Test',
          tabBarIcon: ({ color }) => (
            <Icon name="help-circle-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsScreen}
        options={{
          tabBarLabel: 'Tips',
          tabBarIcon: ({ color }) => (
            <Icon name="bulb-outline" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsStack}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({ color }) => (
            <Icon name="construct-outline" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}