import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ToolsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      <Text style={styles.subtitle}>Password Generator & more</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});