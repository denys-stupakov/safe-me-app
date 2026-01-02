// screens/SavedTipsScreen.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function SavedTipsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Tips</Text>
      <Text style={styles.message}>
        Your bookmarked security tips will appear here
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
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
});