// screens/TestTakingScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function TestTakingScreen({ route }) {
  const { tests } = route.params;
  const navigation = useNavigation();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  
  const currentTest = tests[currentIndex];
  
  const toggleAnswer = (answerId) => {
    setSelectedAnswers(prev =>
      prev.includes(answerId)
        ? prev.filter(id => id !== answerId)
        : [...prev, answerId]
    );
  };
  
  const nextQuestion = () => {
    if (selectedAnswers.length === 0) {
      Alert.alert('Required', 'Please select at least one answer');
      return;
    }
    
    setAllResponses(prev => [
      ...prev,
      { test_id: currentTest.id, selected_answer_ids: selectedAnswers }
    ]);
    
    setSelectedAnswers([]);
    
    if (currentIndex + 1 < tests.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Results', {
        responses: allResponses.concat({
          test_id: currentTest.id,
          selected_answer_ids: selectedAnswers
        }),
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Security Test</Text>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {tests.length}
      </Text>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>{currentTest.content}</Text>
        
        <View style={styles.answers}>
          {currentTest.answers.map(answer => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerButton,
                selectedAnswers.includes(answer.id) && styles.selected,
              ]}
              onPress={() => toggleAnswer(answer.id)}
            >
              <Text
                style={[
                  styles.answerText,
                  selectedAnswers.includes(answer.id) && styles.selectedText,
                ]}
              >
                {answer.content}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
        <Text style={styles.nextText}>
          {currentIndex + 1 === tests.length ? 'Finish Test' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,  // ← Same as ToolsScreen — heading not cut off
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 30,  // ← Lower like ToolsScreen
    color: '#000',
  },
  progress: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  question: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  answers: {
    marginBottom: 40,
  },
  answerButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});