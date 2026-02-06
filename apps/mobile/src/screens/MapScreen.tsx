import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Text, Platform, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { RootStackScreenProps } from '../types/navigation';
import { VenueDto } from '@dubeer/shared';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';

const PARIS_COORDS = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export const MapScreen = ({ navigation }: RootStackScreenProps<'Map'>) => {
    const { token, logout } = useAuth();
    const [location, setLocation] = useState(PARIS_COORDS);
    const [venues, setVenues] = useState<VenueDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            let lat = PARIS_COORDS.latitude;
            let lon = PARIS_COORDS.longitude;

            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Using default location (Paris).');
            } else {
                try {
                    let location = await Location.getCurrentPositionAsync({});
                    lat = location.coords.latitude;
                    lon = location.coords.longitude;
                    setLocation({
                        ...PARIS_COORDS,
                        latitude: lat,
                        longitude: lon,
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            fetchVenues(lat, lon);
        })();
    }, []);

    const fetchVenues = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`${API_URL}/venues/nearby?lat=${lat}&lon=${lon}&radius_m=5000`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setVenues(data);
            if (data.length === 0) {
                Alert.alert('No Venues', 'No venues found nearby. Try moving to a different location (e.g. Paris/Dubai).');
            }
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
