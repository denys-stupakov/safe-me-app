import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import BottomNav from './components/BottomNav';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safe Me</Text>
      <Text style={styles.subtitle}>Your security companion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomNav HomeScreen={HomeScreen} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}