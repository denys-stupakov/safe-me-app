import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function SavedTipsScreen() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchSavedTips = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) throw new Error('No token');
        
        const response = await fetch(`${API_URL}/tips/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error('Failed to load');
        const data = await response.json();
        setTips(data);
      } catch (error) {
        console.error('Error loading saved tips:', error);
        Alert.alert('Error', 'Could not load saved tips');
        setTips([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedTips();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading saved tips...</Text>
      </View>
    );
  }
  
  if (tips.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Saved Tips</Text>
        <Text style={styles.message}>You haven't saved any tips yet.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Tips</Text>
      
      <ScrollView contentContainerStyle={styles.content}>
        {tips.map((tip) => (
          <View key={tip.id} style={styles.tipCard}>
            <Text style={styles.title}>{tip.title}</Text>
            
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
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 40 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 30, marginBottom: 30, color: '#000' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  tipCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, color: '#000' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13, color: '#333', fontWeight: '600' },
  contentText: { fontSize: 17, lineHeight: 26, color: '#333' },
  loadingText: { marginTop: 20, fontSize: 16, textAlign: 'center', color: '#666' },
  message: { fontSize: 18, textAlign: 'center', color: '#666', marginTop: 20 },
});