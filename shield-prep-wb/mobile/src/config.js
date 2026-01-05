import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const getApiUrl = () => {
    // In production, return your hosted backend URL
    if (process.env.NODE_ENV === 'production') {
        return 'https://api.shieldprepwb.com';
    }

    if (Device.isDevice) {
        // Physical Device
        // You would typically manually enter your machine's IP here during dev
        // e.g., 'http://192.168.1.5:3000'
        return 'http://192.168.1.100:3000';
    } else {
        // Emulator/Simulator
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:3000';
        } else {
            return 'http://localhost:3000';
        }
    }
};

export const API_URL = getApiUrl();
