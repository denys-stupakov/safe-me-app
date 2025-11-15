import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import other screens
import TestScreen from '../screens/TestScreen';
import TipsScreen from '../screens/TipsScreen';
import ToolsScreen from '../screens/ToolsScreen';

const Tab = createBottomTabNavigator();

export default function BottomNav({ HomeScreen }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" size={24} color={color} />
          ),
        }}
      />
      
      {/* Test – Question mark */}
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarLabel: 'Test',
          tabBarIcon: ({ color }) => (
            <Icon name="help-circle-outline" size={24} color={color} />
          ),
        }}
      />
      
      {/* Tips */}
      <Tab.Screen
        name="Tips"
        component={TipsScreen}
        options={{
          tabBarLabel: 'Tips',
          tabBarIcon: ({ color }) => (
            <Icon name="bulb-outline" size={24} color={color} />
          ),
        }}
      />
      
      {/* Tools – Wrench / Construction icon */}
      <Tab.Screen
        name="Tools"
        component={ToolsScreen}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({ color }) => (
            <Icon name="construct-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}