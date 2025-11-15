import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function TipsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Daily Tips</Text>
          <Text style={styles.subtitle}>Stay safe</Text>
        </>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Account')}
        >
          <Text style={styles.buttonText}>Login to Access</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});