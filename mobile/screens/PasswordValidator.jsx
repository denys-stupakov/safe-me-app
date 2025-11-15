import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PasswordValidator() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Validator</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});