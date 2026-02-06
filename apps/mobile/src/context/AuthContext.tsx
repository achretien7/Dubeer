import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Test Login function for Sprint 2
const loginWithTestProvider = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider: 'test',
                token: 'ignored',
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Auth Error:', error);
        throw error;
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadToken();
    }, []);

    const loadToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('usertoken');
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        try {
            const accessToken = await loginWithTestProvider();
            setToken(accessToken);
            await AsyncStorage.setItem('usertoken', accessToken);
        } catch (e) {
            alert('Login failed');
            throw e;
        }
    };

    const logout = async () => {
        setToken(null);
        await AsyncStorage.removeItem('usertoken');
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
