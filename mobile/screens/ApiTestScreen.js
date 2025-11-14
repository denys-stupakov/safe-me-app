// screens/ApiTestScreen.js
import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import API from '../config/api';

export default function ApiTestScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API.BASE_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setData(json);
    } catch (err) {
      const msg = err.message.includes('Network')
        ? 'Check Wi-Fi & IP in app.json'
        : err.message;
      setError(msg);
      Alert.alert('Connection Failed', msg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safe Me – API Test</Text>
      <Text style={styles.url}>Backend: {API.HELLO}</Text>
      
      <Button title="Test Connection" onPress={fetchData} disabled={loading} />
      
      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />}
      
      {data && (
        <View style={styles.result}>
          <Text style={styles.label}>Success!</Text>
          <Text style={styles.json}>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
      
      {error && <Text style={styles.error}>Error: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  url: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 20, fontFamily: 'monospace' },
  spinner: { marginTop: 20 },
  result: { marginTop: 20, padding: 15, backgroundColor: '#f0f8f0', borderRadius: 8, borderColor: '#4CAF50', borderWidth: 1 },
  label: { fontWeight: 'bold', color: '#2e7d32' },
  json: { fontFamily: 'monospace', fontSize: 14, color: '#1b5e20', marginTop: 5 },
  error: { color: '#d32f2f', marginTop: 20, textAlign: 'center', fontWeight: 'bold' },
});