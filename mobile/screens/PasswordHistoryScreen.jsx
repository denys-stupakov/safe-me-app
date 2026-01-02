// screens/PasswordHistoryScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.84:8000';

export default function PasswordHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Track which passwords are visible
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) throw new Error('Not logged in');
        
        const response = await fetch(`${API_URL}/passwords/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        // Sort newest first
        setHistory(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (error) {
        console.error('Error loading password history:', error);
        Alert.alert('Error', 'Could not load password history');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  const toggleVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'very_strong': return '#34C759';
      case 'strong': return '#34C759';
      case 'medium': return '#FF9500';
      case 'weak': return '#FF3B30';
      default: return '#8E8E93';
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading history...</Text>
      </View>
    );
  }
  
  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Password History</Text>
        <Text style={styles.message}>
          No generated passwords yet. Use the Password Generator to start!
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Password History</Text>
      
      <ScrollView contentContainerStyle={styles.content}>
        {history.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.date}>
                {format(new Date(item.created_at), 'MMM d, yyyy • h:mm a')}
              </Text>
              <View style={[styles.strengthBadge, { backgroundColor: getStrengthColor(item.strength) }]}>
                <Text style={styles.strengthText}>{item.strength.replace('_', ' ')}</Text>
              </View>
            </View>
            
            <TouchableOpacity onPress={() => toggleVisibility(item.id)}>
              <Text style={styles.password}>
                {visiblePasswords[item.id] ? item.password : '•'.repeat(item.length)}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.details}>
              <Text style={styles.detailText}>Length: {item.length} characters</Text>
              <Text style={styles.detailText}>
                Special characters: {item.exclude_special ? 'No' : 'Yes'}
              </Text>
              <Text style={styles.detailText}>Entropy: {item.entropy.toFixed(1)} bits</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    color: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  strengthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  strengthText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  password: {
    fontSize: 18,
    fontFamily: 'Courier New',
    letterSpacing: 2,
    marginBottom: 16,
    color: '#000',
  },
  details: {
    gap: 6,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
  },
  loading: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    lineHeight: 26,
  },
});