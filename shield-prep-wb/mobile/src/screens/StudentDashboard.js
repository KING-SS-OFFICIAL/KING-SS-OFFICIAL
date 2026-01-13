import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../config';

export default function StudentDashboard({ route, navigation }) {
  const { name, token } = route.params;
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            setContent(data);
        } else {
            Alert.alert('Error', 'Failed to load content');
        }
      } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Network error');
      }
  };

  const openContent = (item) => {
      navigation.navigate('SecureContent', { item, token });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {name}</Text>

      <View style={styles.menu}>
          <Button title="AI Study Buddy" onPress={() => navigation.navigate('AIStudyBuddy')} />
          <View style={{ width: 10 }} />
          <Button title="Progress Tracker" onPress={() => navigation.navigate('ProgressTracker', { token })} color="purple" />
      </View>

      <Text style={styles.sectionTitle}>Your Materials</Text>
      <FlatList
        data={content}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openContent(item)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardType}>{item.type}</Text>
            <Text style={styles.subject}>{item.subject}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No content available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  menu: { flexDirection: 'row', marginBottom: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 10 },
  card: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardType: { fontSize: 12, color: 'gray' },
  subject: { fontSize: 12, color: 'blue' }
});
