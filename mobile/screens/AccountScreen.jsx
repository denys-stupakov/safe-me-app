// screens/AccountScreen.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  
  // Not logged in — old centered style (exactly like your original)
  if (!user) {
    return (
      <View style={styles.notLoggedContainer}>
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
  
  // Logged in — new modern card style with paddingTop 40
  return (
    <ScrollView style={styles.loggedContainer} contentContainerStyle={styles.loggedContent}>
      <Text style={styles.heading}>Hi, {user.email}!</Text>
      <Text style={styles.subtitle}>Manage your account or check saved tips and history</Text>
      
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <Text style={styles.actionText}>Change Password</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('SavedTips')}
      >
        <Text style={styles.actionText}>Saved Tips</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.actionText}>History</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={logout}>
        <Text style={styles.actionText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // NOT LOGGED IN — old centered style
  notLoggedContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // LOGGED IN — new style with top padding
  loggedContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loggedContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  
  // Not logged in buttons
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Logged in action buttons
  actionButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
});