import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation();
  const inputRef = useRef(null);
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
  };
  
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 16 || password.length > 64) {
      Alert.alert('Invalid Password', 'Password must be between 16 and 64 characters');
      return false;
    }
    if (password !== repeatPassword) {
      Alert.alert('Mismatch', 'Passwords do not match');
      return false;
    }
    return true;
  };
  
  const handleRegister = () => {
    if (!email || !password || !repeatPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!validate()) return;
    login(email);
    navigation.goBack();
  };
  
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={dismissKeyboard}>
      <Text style={styles.heading}>Register</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
      />
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