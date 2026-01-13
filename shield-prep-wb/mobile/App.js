import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import StudentDashboard from './src/screens/StudentDashboard';
import SecureContentScreen from './src/screens/SecureContentScreen';
import AIStudyBuddyScreen from './src/screens/AIStudyBuddyScreen';
import ProgressTrackerScreen from './src/screens/ProgressTrackerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="SecureContent" component={SecureContentScreen} />
        <Stack.Screen name="AIStudyBuddy" component={AIStudyBuddyScreen} />
        <Stack.Screen name="ProgressTracker" component={ProgressTrackerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
