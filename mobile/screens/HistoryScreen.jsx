import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>History</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PasswordHistory')}
      >
        <Text style={styles.buttonText}>Password History</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ViewedTipsHistory')}
      >
        <Text style={styles.buttonText}>Viewed Tips History</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WrongAnsweredTests')}
      >
        <Text style={styles.buttonText}>Wrong Answered Tests</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 40, paddingHorizontal: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, marginTop: 30 },
  button: { backgroundColor: '#fff', padding: 18, borderRadius: 16, marginBottom: 16, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  buttonText: { fontSize: 18, textAlign: 'center', color: '#000' },
});