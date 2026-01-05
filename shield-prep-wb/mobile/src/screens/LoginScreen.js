import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as Device from 'expo-device';
import { API_URL } from '../config';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('9876543210'); // Pre-fill for demo
  const [password, setPassword] = useState('studentpass');

  const handleLogin = async () => {
    try {
        const deviceId = (Device.osName || 'unknown') + '-' + (Device.modelName || 'simulator');

        console.log(`Attempting login to ${API_URL}/auth/login`);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password, deviceId })
        });

        const data = await response.json();

        if (response.ok) {
            navigation.replace('StudentDashboard', { token: data.token, name: data.name });
        } else {
            Alert.alert('Login Failed', data.message || 'Unknown error');
        }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Could not connect to server. Ensure backend is running.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ShieldPrep WB</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <View style={{ marginTop: 10 }}>
        <Button title="Register" onPress={() => Alert.alert('Info', 'Contact your teacher to register.')} color="gray" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10, fontSize: 16 }
});
