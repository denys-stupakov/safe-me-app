import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation();
  
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email';
    if (password.length < 16 || password.length > 64) return 'Password must be 16–64 characters';
    return null;
  };
  
  const handleLogin = async () => {
    Keyboard.dismiss();
    const error = validate();
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    
    try {
      const res = await fetch('http://10.0.2.2:8000/auth/login', {  // ← change if needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      
      await login({ email: data.email }, data.access_token);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }
  };
  
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={Keyboard.dismiss}>
      <Text style={styles.heading}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});