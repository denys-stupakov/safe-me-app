import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Keyboard, ScrollView
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const validate = () => {
    if (newPassword.length < 24) return 'New password must be at least 24 characters';
    if (newPassword !== repeatPassword) return 'New passwords do not match';
    return null;
  };
  
  const handleChange = async () => {
    Keyboard.dismiss();
    const error = validate();
    if (error) return Alert.alert('Error', error);
    
    try {
        const token = await SecureStore.getItemAsync("access_token");

      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: user.email,
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      
      if (!res.ok) throw new Error('Failed to change password');
      Alert.alert('Success', 'Password changed successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not change password');
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Keep your account secure</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="Enter current password" />
          
          <Text style={styles.label}>New Password</Text>
          <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="At least 24 characters" />
          
          <Text style={styles.label}>Repeat New Password</Text>
          <TextInput style={styles.input} value={repeatPassword} onChangeText={setRepeatPassword} secureTextEntry placeholder="Type again" />
          
          <TouchableOpacity style={styles.button} onPress={handleChange}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { flexGrow: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 17, color: '#8E8E93', textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 13, color: '#8E8E93', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#F2F2F7', borderRadius: 10, padding: 14, fontSize: 17, marginBottom: 16 },
  button: { backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '600' },
});