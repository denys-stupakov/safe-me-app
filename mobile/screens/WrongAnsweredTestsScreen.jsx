// screens/WrongAnsweredTestsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WrongAnsweredTestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Wrong Answered Tests</Text>
      <Text style={styles.message}>
        Review questions you got wrong to improve your knowledge.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    color: '#000',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    lineHeight: 26,
  },
});