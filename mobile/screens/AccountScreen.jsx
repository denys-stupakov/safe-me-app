import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Account</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi, {user.email}</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 12 },
  registerButton: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});