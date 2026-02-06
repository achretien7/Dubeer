import { Platform } from 'react-native';

// T29: Support for Production API URL via Environment Variables
// In Expo, variables starting with EXPO_PUBLIC_ are available in the client code.
const PROD_API_URL = process.env.EXPO_PUBLIC_API_URL;

const DEV_API_URL = Platform.select({
    android: 'http://10.0.2.2:3000/api/v1',
    ios: 'http://localhost:3000/api/v1',
    default: 'http://localhost:3000/api/v1',
});

// Use Prod URL if available, otherwise fallback to Dev
export const API_URL = PROD_API_URL || DEV_API_URL;
