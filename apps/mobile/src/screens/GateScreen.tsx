import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackScreenProps } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

export const GateScreen = ({ navigation }: RootStackScreenProps<'Gate'>) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkGate();
    }, []);

    const checkGate = async () => {
        try {
            const verified = await AsyncStorage.getItem('is_age_verified');
            if (verified === 'true') {
                navigation.replace('Map');
            } else {
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    const handleYes = async () => {
        try {
            await AsyncStorage.setItem('is_age_verified', 'true');
            navigation.replace('Map');
        } catch (e) {
            Alert.alert('Error', 'Failed to save status');
        }
    };

    const handleNo = () => {
        Alert.alert('Sorry', 'You must be 21+ to use this app.');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome to Dubeer</Text>
            <Text style={styles.subtitle}>Are you 21 years or older?</Text>
            <View style={styles.buttonContainer}>
                <Button title="Yes, I am 21+" onPress={handleYes} />
                <View style={styles.spacer} />
                <Button title="No, I am not" onPress={handleNo} color="red" />
            </View>
            <Text style={styles.disclaimer}>
                By continuing, you acknowledge that this is a demo application.
                Data is user-generated and may not be accurate.
                Alcohol consumption is strictly for 21+ in Dubai.
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
    },
    spacer: {
        height: 10,
    },
    disclaimer: {
        marginTop: 40,
        fontSize: 12,
        color: 'gray',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
