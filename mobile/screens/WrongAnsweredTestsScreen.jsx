// screens/WrongAnsweredTestsScreen.jsx
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

export default function WrongAnsweredTestsScreen() {
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWrongAnswers = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) {
          Alert.alert('Not logged in', 'Please log in to view history');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/tests/wrong-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to load');
        }
        
        const data = await response.json();
        setWrongQuestions(data);
      } catch (error) {
        console.error('Error loading wrong answers:', error);
        Alert.alert('Error', 'Could not load wrong answered tests');
        setWrongQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWrongAnswers();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading wrong answers...</Text>
      </View>
    );
  }
  
  if (wrongQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Wrong Answered Tests</Text>
        <Text style={styles.message}>
          No wrong answers yet — keep taking tests to improve your knowledge!
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wrong Answered Tests</Text>
      
      <ScrollView contentContainerStyle={styles.reviewContent}>
        <Text style={styles.wrongHeader}>
          Review ({wrongQuestions.length} questions)
        </Text>
        
        {wrongQuestions.map((q, i) => (
          <View key={i} style={styles.wrongCard}>
            <Text style={styles.question}>{q.content}</Text>
            
            {/* Topic tags */}
            <View style={styles.tagContainer}>
              {q.topics.map((topic, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{topic}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.your}>
              You selected: {q.selected.join(', ') || 'Nothing'}
            </Text>
            <Text style={styles.correct}>
              Correct: {q.correct.join(', ')}
            </Text>
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
  reviewContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  wrongHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  wrongCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  question: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
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
  your: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 6,
  },
  correct: {
    fontSize: 16,
    color: '#388e3c',
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