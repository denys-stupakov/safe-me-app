import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import API from '../config/api'; // ← your API constants

export default function PasswordValidator() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!password) {
      Alert.alert('Empty', 'Please enter a password');
      return;
    }

    try {
      const res = await fetch(API.VALIDATOR_VALIDATE || 'http://172.27.224.1:8000/validator/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed');

      setResult(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const getStrengthColor = () => {
    if (!result) return '#ccc';
    switch (result.color) {
      case 'Red': return '#ef4444';
      case 'Orange': return '#f97316';
      case 'Yellow': return '#eab308';
      case 'Green': return '#22c55e';
      case 'Dark Green': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Password Validator</Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password to check strength"
        secureTextEntry={false}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Analyze Password</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.strengthText}>Strength: <Text style={[styles.strengthValue, { color: getStrengthColor() }]}>{result.strength}</Text></Text>

          <View style={styles.metrics}>
            <Text style={styles.metric}>Length: {result.length}</Text>
            <Text style={styles.metric}>Entropy: {result.entropy} bits</Text>
          </View>

          <View style={styles.checks}>
            <Text style={result.has_lowercase ? styles.good : styles.bad}>Lowercase</Text>
            <Text style={result.has_uppercase ? styles.good : styles.bad}>Uppercase</Text>
            <Text style={result.has_digits ? styles.good : styles.bad}>Numbers</Text>
            <Text style={result.has_special ? styles.good : styles.bad}>Special chars</Text>
          </View>

          {result.warnings.length > 0 && (
            <View style={styles.warnings}>
              <Text style={styles.warningTitle}>Warnings:</Text>
              {result.warnings.map((w, i) => (
                <Text key={i} style={styles.warning}>• {w}</Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 30 },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    elevation: 3,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  resultCard: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  strengthText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  strengthValue: { fontSize: 28 },
  metrics: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  metric: { fontSize: 16, fontWeight: '600' },
  checks: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  good: { color: '#22c55e', fontWeight: 'bold' },
  bad: { color: '#ef4444', fontWeight: 'bold' },
  warnings: { marginTop: 20 },
  warningTitle: { fontWeight: 'bold', color: '#dc2626', marginBottom: 8 },
  warning: { color: '#991b1b', marginLeft: 10 },
});