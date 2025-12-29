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
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function TestScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`${API_URL}/topics`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        Alert.alert('Offline Mode', 'Using default topics');
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
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };
  
  const startTest = async () => {
    if (selectedTopics.length === 0) {
      Alert.alert('Select Topics', 'Please select at least one topic');
      return;
    }
    
    try {
      const response = await fetch(
        `${API_URL}/tests/random?topic_ids=${selectedTopics.join(',')}&limit=10`
      );
      if (!response.ok) throw new Error();
      const tests = await response.json();
      
      if (tests.length === 0) {
        Alert.alert('No Questions', 'No questions found for selected topics');
        return;
      }
      
      navigation.navigate('TestTaking', { tests });
    } catch (error) {
      Alert.alert('Error', 'Could not load test');
    }
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Security Test</Text>
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
    <View style={styles.container}>
      <Text style={styles.heading}>Security Test</Text>
      <Text style={styles.subtitle}>Choose topics to test your knowledge</Text>
      
      <ScrollView contentContainerStyle={styles.topicScroll}>
        <View style={styles.topicContainer}>
          {topics.map((topic) => (
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
      </ScrollView>
      
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
    marginBottom: 30,
    marginTop: 30,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  topicScroll: {
    flexGrow: 1,
  },
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  topicButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
  },
  topicButtonSelected: {
    backgroundColor: '#007AFF',
  },
  topicText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  topicTextSelected: {
    color: '#fff',
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#aaa',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});