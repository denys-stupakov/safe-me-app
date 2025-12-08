// screens/LoginScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Keyboard, SafeAreaView, ScrollView
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email address';
    if (password.length < 24) return 'Password too short (min 24)';
    return null;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    const error = validate();
    if (error) return Alert.alert('Invalid Input', error);

    try {
      await login(email, password);
      navigation.navigate('Account');
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to Safe Me</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Master Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 24 characters"
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 17, color: '#8E8E93', textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 13, color: '#8E8E93', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#F2F2F7', borderRadius: 10, padding: 14, fontSize: 17, marginBottom: 16 },
  loginButton: { backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: 'white', fontSize: 17, fontWeight: '600' },
  link: { textAlign: 'center', color: '#007AFF', fontSize: 16 },
});