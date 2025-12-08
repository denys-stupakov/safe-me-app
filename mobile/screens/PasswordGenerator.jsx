import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Clipboard, // ← NEW: for copying
} from 'react-native';

import API from "../config/api"

export default function PasswordGenerator() {
  const [rawLength, setRawLength] = useState('24');
  const [length, setLength] = useState(24);
  const [excludeSpecial, setExcludeSpecial] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState(''); // ← NEW STATE
  const inputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
  };

  const validateAndSetLength = () => {
    const min = excludeSpecial ? 26 : 24;
    let num = parseInt(rawLength);

    if (isNaN(num) || rawLength.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a number.');
      setRawLength(length.toString());
      return;
    }

    if (num < min) {
      Alert.alert('Too Short', `Password length must be at least ${min}.`);
      setRawLength(min.toString());
      setLength(min);
      return;
    }

    if (num > 64) {
      Alert.alert('Too Long', 'Password length must not exceed 64.');
      setRawLength('64');
      setLength(64);
      return;
    }

    setLength(num);
  };

  const handleBlur = () => {
    dismissKeyboard();
    validateAndSetLength();
  };

  const handleCheckboxToggle = () => {
    setExcludeSpecial(prev => {
      const newValue = !prev;
      console.log('Checkbox toggled → exclude_special =', newValue);
      if (newValue && length < 26) {
        setLength(26);
        setRawLength('26');
      }
      return newValue;
    });
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch(API.PASSWORD_GENERATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          length: rawLength,
          exclude_special: excludeSpecial,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed');

      setGeneratedPassword(data.password);

      console.log(data.password)
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      Clipboard.setString(generatedPassword);
      Alert.alert('Copied!', 'Password copied to clipboard');
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={dismissKeyboard}>
      <Text style={styles.heading}>Password Generator</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password Length</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={rawLength}
          onChangeText={setRawLength}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={2}
          placeholder="24"
        />
      </View>

      <TouchableOpacity style={styles.checkboxRow} onPress={handleCheckboxToggle}>
        <View style={[styles.checkbox, excludeSpecial && styles.checkboxChecked]}>
          {excludeSpecial && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Exclude special characters</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Generate Password</Text>
      </TouchableOpacity>

      {/* ←←← NEW SECTION: PASSWORD DISPLAY + COPY BUTTON ←←← */}
      {generatedPassword ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your Secure Password</Text>
          <View style={styles.passwordBox}>
            <Text style={styles.passwordText} selectable>{generatedPassword}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Generate a password to see it here</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ←←← NEW STYLES ←←←
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
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8, color: '#000' },
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: '#007AFF' },
  checkboxInner: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#fff' },
  checkboxLabel: { fontSize: 16, color: '#000' },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 30,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  // ← NEW STYLES
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  passwordBox: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 12,
  },
  passwordText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#007AFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});