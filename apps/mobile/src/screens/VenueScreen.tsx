import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Modal, Alert, TouchableOpacity } from 'react-native';
import { RootStackScreenProps } from '../types/navigation';
import { API_URL } from '../config/api';
import { PriceDto } from '@dubeer/shared';
import { useAuth } from '../context/AuthContext';

export const VenueScreen = ({ route, navigation }: RootStackScreenProps<'Venue'>) => {
    const { venueId } = route.params;
    const { token } = useAuth();

    const [prices, setPrices] = useState<PriceDto[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalVisible, setModalVisible] = useState(false);
    const [newPrice, setNewPrice] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const response = await fetch(`${API_URL}/venues/${venueId}/prices`);
            if (response.ok) {
                const data = await response.json();
                setPrices(data);
            } else {
                Alert.alert('Error', 'Failed to fetch prices');
            }
        } catch (e) {
            Alert.alert('Network Error', 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPrice = async () => {
        if (!token) {
            Alert.alert('Login Required', 'Please login to add a price', [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Login', onPress: () => {
                        setModalVisible(false);
                        navigation.navigate('Login');
                    }
                }
            ]);
            return;
        }

        const amount = parseFloat(newPrice);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Price', 'Please enter a valid amount');
            return;
        }

        setSubmitting(true);
        // Optimistic Update
        const tempId = Math.random().toString();
        const optimisticPrice: PriceDto = {
            id: tempId,
            amount: amount.toString(),
            currency: 'AED',
            created_at: new Date().toISOString(),
            venueId,
            score: 0
        };

        setPrices(prev => [optimisticPrice, ...prev]);
        setModalVisible(false);
        setNewPrice('');

        try {
            const response = await fetch(`${API_URL}/prices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    venueId,
                    amount
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            // Ideally replace temp item with real one, but simplified for MVP:
            fetchPrices(); // Refresh to ensure consistency
        } catch (e) {
            Alert.alert('Error', 'Failed to submit price');
            // Rollback
            setPrices(prev => prev.filter(p => p.id !== tempId));
        } finally {
            setSubmitting(false);
        }
    };

    const handleVote = async (priceId: string, value: number) => {
        if (!token) {
            Alert.alert('Login Required', 'Please login to vote');
            return;
        }

        // Optimistic Update
        setPrices(prev => prev.map(p => {
            if (p.id === priceId) {
                // Simplified optimistic: we don't know the exact previous state (toggle vs flip)
                // for MVP, just adding value visually. Real consistency on refresh.
                // Better approach: assume +1/-1
                return { ...p, score: p.score + value };
            }
            return p;
        }));

        try {
            const response = await fetch(`${API_URL}/prices/${priceId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value })
            });

            if (response.ok) {
                const data = await response.json();
                // Update with server truth (handles toggle logic correctly)
                setPrices(prev => prev.map(p =>
                    p.id === priceId ? { ...p, score: data.score } : p
                ));
            }
        } catch (e) {
            console.error(e);
            fetchPrices(); // Re-sync on error
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Latest Prices</Text>

            <FlatList
                data={prices}
                keyExtractor={item => item.id}
                refreshing={loading}
                onRefresh={fetchPrices}
                renderItem={({ item }) => (
                    <View style={styles.priceItem}>
                        <View style={styles.priceInfo}>
                            <Text style={styles.amount}>{Number(item.amount).toFixed(2)} {item.currency}</Text>
                            <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.voteContainer}>
                            <TouchableOpacity onPress={() => handleVote(item.id, 1)}>
                                <Text style={styles.voteBtn}>▲</Text>
                            </TouchableOpacity>
                            <Text style={[
                                styles.score,
                                item.score > 0 ? styles.scorePositive :
                                    item.score < 0 ? styles.scoreNegative : null
                            ]}>
                                {item.score}
                            </Text>
                            <TouchableOpacity onPress={() => handleVote(item.id, -1)}>
                                <Text style={styles.voteBtn}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.empty}>No prices yet.</Text>
                        <Text style={styles.subEmpty}>Be the first to add one!</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Beer Price</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Amount (AED)"
                            keyboardType="numeric"
                            value={newPrice}
                            onChangeText={setNewPrice}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                            <View style={{ width: 10 }} />
                            <Button title="Submit" onPress={handleAddPrice} disabled={submitting} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    priceItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    priceInfo: {
        flex: 1,
    },
    voteContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    voteBtn: {
        fontSize: 20,
        padding: 5,
        color: '#007AFF',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
    },
    scorePositive: {
        color: '#2e7d32',
    },
    scoreNegative: {
        color: '#d32f2f',
    },
    date: {
        color: 'gray',
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    empty: {
        marginTop: 10,
        color: 'gray',
        fontSize: 18,
    },
    subEmpty: {
        color: 'gray',
        marginTop: 5,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        fontSize: 18,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
});
