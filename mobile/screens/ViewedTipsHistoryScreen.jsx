// screens/ViewedTipsHistoryScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.84:8000';

export default function ViewedTipsHistoryScreen() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchViewedTips = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) {
          Alert.alert('Not logged in', 'Please log in to view history');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/tips/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to load');
        }
        
        const data = await response.json();
        setTips(data);
      } catch (error) {
        console.error('Error loading viewed tips:', error);
        Alert.alert('Error', 'Could not load viewed tips history');
        setTips([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchViewedTips();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading viewed tips...</Text>
      </View>
    );
  }
  
  if (tips.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Viewed Tips History</Text>
        <Text style={styles.message}>
          You haven't viewed any tips yet. Start reading to build your history!
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Viewed Tips History</Text>
      
      <ScrollView contentContainerStyle={styles.content}>
        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <Text style={styles.title}>{tip.title}</Text>
            
            {/* Topic tags */}
            <View style={styles.tagContainer}>
              {tip.topics.map((topic, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{topic}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.contentText}>{tip.content}</Text>
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
  tipCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  contentText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#333',
  },
  loadingText: {
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