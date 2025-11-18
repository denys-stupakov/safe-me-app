import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation();
  
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email';
    if (password.length < 16 || password.length > 64) return 'Password must be 16–64 characters';
    if (password !== repeatPassword) return 'Passwords do not match';
    return null;
  };
  
  const handleRegister = async () => {
    Keyboard.dismiss();
    const error = validate();
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    
    try {
      const res = await fetch('http://10.0.2.2:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Registration failed');
      
      await login({ email: data.email }, data.access_token);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Register Failed', err.message);
    }
  };
  
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={Keyboard.dismiss}>
      <Text style={styles.heading}>Register</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Repeat Password" value={repeatPassword} onChangeText={setRepeatPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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