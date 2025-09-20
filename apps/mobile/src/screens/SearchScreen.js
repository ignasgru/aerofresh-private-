import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../lib/network';
// Simple icon components
const SearchIcon = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDD0D" }));
const PlaneIcon = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2708\uFE0F" }));
export default function SearchScreen({ navigation }) {
    const [tail, setTail] = useState('');
    const [loading, setLoading] = useState(false);
    const searchAircraft = async () => {
        if (!tail.trim()) {
            Alert.alert('Error', 'Please enter a tail number');
            return;
        }
        setLoading(true);
        try {
            const { data, isDemo } = await api.aircraftSummary(tail.toUpperCase());
            if (data) {
                navigation.navigate('TailSummary', {
                    summary: data,
                    tail: tail.toUpperCase()
                });
                if (isDemo) {
                    Alert.alert('Demo Mode', `Showing demo data for ${tail.toUpperCase()}\n\nUsing offline demo data due to network connectivity.`);
                }
            }
            else {
                Alert.alert('Not Found', 'Aircraft not found in our database');
            }
        }
        catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch aircraft data. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const quickSearch = (tailNumber) => {
        setTail(tailNumber);
        searchAircraft();
    };
    return (_jsxs(ScrollView, { style: styles.container, contentContainerStyle: styles.contentContainer, children: [_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: styles.title, children: "Aircraft Search" }), _jsx(Text, { style: styles.subtitle, children: "Enter a tail number to get detailed aircraft information" })] }), _jsxs(View, { style: styles.searchContainer, children: [_jsxs(View, { style: styles.inputContainer, children: [_jsx(PlaneIcon, { size: 20, color: "#6B7280" }), _jsx(TextInput, { style: styles.input, placeholder: "Enter tail number (e.g., N123AB)", placeholderTextColor: "#9CA3AF", autoCapitalize: "characters", value: tail, onChangeText: setTail, onSubmitEditing: searchAircraft, returnKeyType: "search" })] }), _jsx(TouchableOpacity, { style: [styles.searchButton, loading && styles.searchButtonDisabled], onPress: searchAircraft, disabled: loading, children: loading ? (_jsx(ActivityIndicator, { color: "#fff" })) : (_jsxs(_Fragment, { children: [_jsx(SearchIcon, { size: 20, color: "white" }), _jsx(Text, { style: styles.searchButtonText, children: "Search" })] })) })] }), _jsxs(View, { style: styles.quickSearchSection, children: [_jsx(Text, { style: styles.sectionTitle, children: "Quick Search Examples" }), _jsx(View, { style: styles.quickSearchGrid, children: ['N123AB', 'N456CD', 'N789EF', 'N101GH'].map((example) => (_jsx(TouchableOpacity, { style: styles.quickSearchButton, onPress: () => quickSearch(example), children: _jsx(Text, { style: styles.quickSearchText, children: example }) }, example))) })] }), _jsxs(View, { style: styles.featuresSection, children: [_jsx(Text, { style: styles.sectionTitle, children: "What you can find:" }), _jsxs(View, { style: styles.featureList, children: [_jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: { fontSize: 20, color: '#10B981' }, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "Registration status and airworthiness" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: { fontSize: 20, color: '#F59E0B' }, children: "\u26A0\uFE0F" }), _jsx(Text, { style: styles.featureText, children: "Accident and incident history" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: { fontSize: 20, color: '#3B82F6' }, children: "\uD83D\uDC65" }), _jsx(Text, { style: styles.featureText, children: "Ownership history" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: { fontSize: 20, color: '#8B5CF6' }, children: "\uD83D\uDCC4" }), _jsx(Text, { style: styles.featureText, children: "Airworthiness directives" })] })] })] })] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    contentContainer: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    searchContainer: {
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#111827',
    },
    searchButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    searchButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    quickSearchSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    quickSearchGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickSearchButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    quickSearchText: {
        color: '#3B82F6',
        fontWeight: '500',
    },
    featuresSection: {
        marginBottom: 30,
    },
    featureList: {
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    featureText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
});
