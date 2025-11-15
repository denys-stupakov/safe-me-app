import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';

export default function PasswordValidator() {
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
  };
  
  const handleBlur = () => {
    dismissKeyboard();
    if (password.length > 64) {
      Alert.alert('Too Long', 'Password must not exceed 64 characters. It has been truncated.');
      setPassword(password.slice(0, 64));
    }
  };
  
  const handleSubmit = () => {
    if (password.length === 0) {
      Alert.alert('Empty', 'Please enter a password to validate.');
      return;
    }
    Alert.alert('Validate', `Sending password of length ${password.length} to FastAPI...`);
  };
  
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={dismissKeyboard}>
      <Text style={styles.heading}>Password Validator</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Enter Password</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          onBlur={handleBlur}
          placeholder="Type or paste password"
          secureTextEntry={false}
          maxLength={100}
          multiline={false}
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Validate</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
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
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});