// screens/ResultsScreen.jsx
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
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";  // ← This reads app.json extra

const API_URL = Constants.expoConfig?.extra?.apiUrl;

export default function ResultsScreen({ route }) {
  const { responses } = route.params;
  const navigation = useNavigation();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const calculateScore = async () => {
      if (responses.length === 0) {
        setResult({ score: 0, total: 0, correct: 0, wrong_questions: [] });
        setLoading(false);
        return;
      }
      
      try {
          const token = await SecureStore.getItemAsync("access_token");

        const res = await fetch(`${API_URL}/tests/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${token}`},
          body: JSON.stringify(responses),
        });
        
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResult(data);
      } catch (err) {
        Alert.alert('Error', 'Could not calculate score');
        setResult({ score: 0, total: responses.length, correct: 0, wrong_questions: [] });
      } finally {
        setLoading(false);
      }
    };
    
    calculateScore();
  }, [responses]);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Calculating score...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Test Complete!</Text>
      
      <View style={styles.scoreCard}>
        <Text style={styles.score}>{Math.round(result.score)}%</Text>
        <Text style={styles.details}>{result.correct} / {result.total} correct</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.reviewContent}>
        {result.wrong_questions.length > 0 ? (
          <>
            <Text style={styles.wrongHeader}>
              Wrong Answers ({result.wrong_questions.length})
            </Text>
            {result.wrong_questions.map((q, i) => (
              <View key={i} style={styles.wrongCard}>
                <Text style={styles.question}>{q.content}</Text>
                <Text style={styles.your}>You selected: {q.selected.join(', ') || 'Nothing'}</Text>
                <Text style={styles.correct}>Correct: {q.correct.join(', ')}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.perfect}>Perfect score! 🎉</Text>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate('TestHome')}
      >
        <Text style={styles.doneText}>Back to Tests</Text>
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
  scoreCard: {
    backgroundColor: '#007AFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 30,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  details: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
  },
  reviewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  your: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 6,
  },
  correct: {
    fontSize: 16,
    color: '#388e3c',
  },
  perfect: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#388e3c',
    textAlign: 'center',
    marginBottom: 40,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});