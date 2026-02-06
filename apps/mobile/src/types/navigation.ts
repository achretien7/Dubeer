import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Gate: undefined;
    Map: undefined;
    Venue: { venueId: string };
    Login: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;
