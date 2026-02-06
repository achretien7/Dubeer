import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Platform, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { RootStackScreenProps } from '../types/navigation';
import { VenueDto } from '@dubeer/shared';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

const DUBAI_COORDS = {
    latitude: 25.2048,
    longitude: 55.2708,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

// Start directly with Dubai as default instead of Paris
const DEFAULT_COORDS = DUBAI_COORDS;

export const MapScreen = ({ navigation }: RootStackScreenProps<'Map'>) => {
    const { token, logout } = useAuth();
    const [location, setLocation] = useState(DEFAULT_COORDS);
    const [venues, setVenues] = useState<VenueDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let lat = DEFAULT_COORDS.latitude;
            let lon = DEFAULT_COORDS.longitude;
            let permissionGranted = false;

            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    let loc = await Location.getCurrentPositionAsync({});
                    lat = loc.coords.latitude;
                    lon = loc.coords.longitude;
                    permissionGranted = true;

                    setLocation({
                        ...DEFAULT_COORDS,
                        latitude: lat,
                        longitude: lon,
                    });
                } else {
                    Alert.alert('Permission denied', 'Using default location (Dubai).');
                }
            } catch (e) {
                console.error('Location error:', e);
            }

            fetchVenues(lat, lon, permissionGranted);
        })();
    }, []);

    const fetchVenues = async (lat: number, lon: number, isRealLocation: boolean) => {
        try {
            // T33: Location Fallback Strategy
            // 1. Try fetching at requested location
            let response = await fetch(`${API_URL}/venues/nearby?lat=${lat}&lon=${lon}&radius_m=20000`); // Increased radius default
            if (!response.ok) throw new Error('Network response was not ok');

            let data = await response.json();

            // 2. Fallback Rule: If real location returns empty, try Dubai
            if (data.length === 0 && isRealLocation) {
                console.log('No venues found at real location. Fallback to Dubai.');
                const fallbackResponse = await fetch(`${API_URL}/venues/nearby?lat=${DUBAI_COORDS.latitude}&lon=${DUBAI_COORDS.longitude}&radius_m=20000`);
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.length > 0) {
                        data = fallbackData;
                        // Move map to Dubai so user sees the pins
                        setLocation(DUBAI_COORDS);
                        Alert.alert('Demo Mode', 'No venues found nearby. Teleporting you to Dubai!');
                    } else {
                        Alert.alert('No Venues', 'No venues found nearby or in Dubai.');
                    }
                }
            } else if (data.length === 0) {
                Alert.alert('No Venues', 'No venues found in Dubai (Default). check seed.');
            }

            setVenues(data);
        } catch (error) {
            Alert.alert('Network Error', 'Failed to fetch venues. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                style={styles.map}
                region={location}
                showsUserLocation={true}
            >
                {venues.map((venue) => (
                    <Marker
                        key={venue.id}
                        coordinate={{
                            latitude: venue.latitude,
                            longitude: venue.longitude,
                        }}
                        title={venue.name}
                        description={venue.address || venue.city_area}
                        onCalloutPress={() => navigation.navigate('Venue', { venueId: venue.id })}
                    />
                ))}
            </MapView>

            <View style={styles.authButtonContainer}>
                {token ? (
                    <Button title="Logout" onPress={logout} color="red" />
                ) : (
                    <Button title="Login" onPress={() => navigation.navigate('Login')} />
                )}
            </View>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading venues...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 10,
        borderRadius: 8,
    },
    authButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
