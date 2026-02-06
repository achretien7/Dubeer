import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackScreenProps } from '../types/navigation';

export const LoginScreen = ({ navigation }: RootStackScreenProps<'Login'>) => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login();
            navigation.goBack();
        } catch (e) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>Sign in to add venue prices</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Continue with Test Account" onPress={handleLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        marginBottom: 40,
        color: 'gray'
    }
});
