import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ChatScreen from './src/screens/ChatScreen';
import BackgroundService from './src/services/BackgroundService';

export default function App() {

  useEffect(() => {
    // Initialize background task registration
    BackgroundService.registerBackgroundTask();

    return () => {
      // Optional: unregister if you only want it while app is open,
      // but usually for background tasks you leave it.
    };
  }, []);

  return (
    <View style={styles.container}>
      <ChatScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
