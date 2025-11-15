import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';

export default function PasswordGenerator() {
  const [rawLength, setRawLength] = useState('16');
  const [length, setLength] = useState(16);
  const [excludeSpecial, setExcludeSpecial] = useState(false);
  const inputRef = useRef(null);
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    inputRef.current?.blur();
  };
  
  const validateAndSetLength = () => {
    const min = excludeSpecial ? 17 : 16;
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
    const newExclude = !excludeSpecial;
    setExcludeSpecial(newExclude);
    if (newExclude && length < 17) {
      setLength(17);
      setRawLength('17');
      Alert.alert('Adjusted', 'Minimum length increased to 17 when excluding special characters.');
    }
  };
  
  const handleGenerate = () => {
    Alert.alert('Generate', `Length: ${length}, Exclude Special: ${excludeSpecial}`);
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
          placeholder="16"
        />
      </View>
      
      <TouchableOpacity style={styles.checkboxRow} onPress={handleCheckboxToggle}>
        <View style={[styles.checkbox, excludeSpecial && styles.checkboxChecked]}>
          {excludeSpecial && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Exclude special characters</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Generate</Text>
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
    marginBottom: 20,
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
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
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