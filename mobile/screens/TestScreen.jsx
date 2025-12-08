// screens/TestScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import API from "../config/api"

// Use your backend URL from .env or fallback
const API_URL = API.TOPICS || 'http://192.168.1.81:8000'; // ← Change if needed

export default function TestScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Failed to load topics:', error);
        Alert.alert('Offline Mode', 'Using default topics...');
        // Fallback topics (in case backend is off)
        setTopics([
          { id: 1, name: 'Password management' },
          { id: 2, name: 'Phishing awareness' },
          { id: 3, name: 'Safe browsing' },
          { id: 4, name: '2FA' },
          { id: 5, name: 'Device Security' },
          { id: 6, name: 'E-mail & communication security' },
          { id: 7, name: 'Data backup' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, []);
  
  const toggleTopic = (topicId) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };
  
  const startTest = async () => {
    if (selectedTopics.length === 0) {
      Alert.alert('Select Topics', 'Please choose at least one topic.');
      return;
    }
    
    try {
      const response = await fetch(
        `${API_URL}/tests/random?topic_ids=${selectedTopics.join(',')}`
      );
      if (!response.ok) throw new Error('Failed to load questions');
      const tests = await response.json();
      
      // Randomize order
      const shuffled = tests.sort(() => Math.random() - 0.5);
      
      navigation.navigate('TestTaking', {
        tests: shuffled,
        selectedTopicNames: topics
        .filter(t => selectedTopics.includes(t.id))
        .map(t => t.name),
      });
    } catch (error) {
      Alert.alert('Error', 'Could not load test. Try again later.');
    }
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Security Test</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Account')}
        >
          <Text style={styles.loginButtonText}>Login to Access Tests</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Security Test</Text>
      <Text style={styles.subtitle}>Choose topics to test your knowledge</Text>
      
      <View style={styles.topicContainer}>
        {topics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.topicButton,
              selectedTopics.includes(topic.id) && styles.topicButtonSelected,
            ]}
            onPress={() => toggleTopic(topic.id)}
          >
            <Text
              style={[
                styles.topicText,
                selectedTopics.includes(topic.id) && styles.topicTextSelected,
              ]}
            >
              {topic.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        style={[
          styles.startButton,
          selectedTopics.length === 0 && styles.startButtonDisabled,
        ]}
        onPress={startTest}
        disabled={selectedTopics.length === 0}
      >
        <Text style={styles.startButtonText}>
          Start Test ({selectedTopics.length} selected)
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 70 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#000' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  topicContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 },
  topicButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  topicButtonSelected: { backgroundColor: '#007AFF', borderColor: '#005edc' },
  topicText: { fontSize: 15, fontWeight: '600', color: '#333' },
  topicTextSelected: { color: '#fff' },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  startButtonDisabled: { backgroundColor: '#999' },
  startButtonText: { color: '#fff', fontSize: 19, fontWeight: 'bold' },
  loginButton: { backgroundColor: '#007AFF', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
});