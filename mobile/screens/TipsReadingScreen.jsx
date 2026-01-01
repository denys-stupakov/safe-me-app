// screens/TipsReadingScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.1.84:8000';

export default function TipsReadingScreen({ route }) {
  const { tips, currentIndex: initialIndex = 0 } = route.params;
  const navigation = useNavigation();
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const currentTip = tips[currentIndex];
  
  const markViewed = async () => {
    try {
      await fetch(`${API_URL}/tips/view/${currentTip.id}`, { method: 'POST' });
    } catch (err) {
      // Silent — not critical
    }
  };
  
  const toggleFavorite = async () => {
    try {
      const res = await fetch(`${API_URL}/tips/favorite/${currentTip.id}`, { method: 'POST' });
      const data = await res.json();
      setIsFavorite(data.message.includes('Added'));
    } catch (err) {
      Alert.alert('Error', 'Could not save favorite');
    }
  };
  
  const nextTip = () => {
    markViewed();
    if (currentIndex + 1 < tips.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFavorite(false);
    } else {
      Alert.alert('Finished', 'You\'ve read all tips!');
      navigation.navigate('TipsHome');
    }
  };
  
  React.useEffect(() => {
    markViewed();
  }, [currentTip.id]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Security Tip</Text>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tipCard}>
          <Text style={styles.title}>{currentTip.title}</Text>
          <Text style={styles.contentText}>{currentTip.content}</Text>
        </View>
      </ScrollView>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteText}>
            {isFavorite ? '★ Saved' : '☆ Save Tip'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={nextTip}>
          <Text style={styles.nextText}>
            {currentIndex + 1 === tips.length ? 'Finish' : 'Next Tip'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 40 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 30, marginBottom: 30, color: '#000' },
  content: { paddingHorizontal: 20, flexGrow: 1 },
  tipCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#000' },
  contentText: { fontSize: 17, lineHeight: 26, color: '#333' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 40 },
  favoriteButton: { backgroundColor: '#34C759', padding: 16, borderRadius: 12, flex: 1, marginRight: 8, alignItems: 'center' },
  favoriteText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  nextButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, flex: 1, marginLeft: 8, alignItems: 'center' },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});