// screens/RegisterScreen.jsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Keyboard, SafeAreaView, ScrollView
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const { register } = useAuth();
  const navigation = useNavigation();

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email';
    if (password.length < 16) return 'Password must be at least 16 characters';
    if (password !== repeat) return 'Passwords do not match';
    return null;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    const error = validate();
    if (error) return Alert.alert('Error', error);

    try {
      await register(email, password);
      navigation.navigate('Account');
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Safe Me today</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Master Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Create a strong password" secureTextEntry />

          <Text style={styles.label}>Repeat Password</Text>
          <TextInput style={styles.input} value={repeat} onChangeText={setRepeat} placeholder="Type it again" secureTextEntry />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
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
  registerButton: { backgroundColor: '#34C759', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  registerButtonText: { color: 'white', fontSize: 17, fontWeight: '600' },
  link: { textAlign: 'center', color: '#007AFF', fontSize: 16 },
});