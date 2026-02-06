import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GateScreen } from '../screens/GateScreen';
import { MapScreen } from '../screens/MapScreen';
import { VenueScreen } from '../screens/VenueScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Gate">
            <Stack.Screen
                name="Gate"
                component={GateScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{ title: 'Nearby Venues', headerBackVisible: false }}
            />
            <Stack.Screen
                name="Venue"
                component={VenueScreen}
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ presentation: 'modal', title: 'Login' }}
            />
        </Stack.Navigator>
    );
};
