import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ToolsScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tools</Text>
      
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('Tools', { screen: 'PasswordGenerator' })}
      >
        <Icon name="key-outline" size={24} color="#007AFF" />
        <Text style={styles.rowText}>Password Generator</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('Tools', { screen: 'PasswordValidator' })}
      >
        <Icon name="checkmark-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.rowText}>Password Validator</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 30,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rowText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#000',
  },
});