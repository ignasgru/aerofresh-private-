import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { api } from '../lib/network';
// Simple icon components
const LiveIcon = ({ size = 24, color = '#10B981' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCE1" }));
const PlaneIcon = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2708\uFE0F" }));
export default function LiveTrackingScreen({ navigation }) {
    const [livePositions, setLivePositions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isDemoMode, setIsDemoMode] = useState(false);
    // Load live data on mount
    useEffect(() => {
        fetchLiveData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchLiveData, 30000);
        return () => clearInterval(interval);
    }, []);
    const fetchLiveData = async () => {
        setIsLoading(true);
        try {
            const { data, mode, isDemo } = await api.livePositions(20, 30);
            setLivePositions(data.positions || []);
            setLastUpdate(new Date());
            setIsDemoMode(isDemo);
            console.log(`📡 Live data fetched: ${isDemo ? 'Demo mode' : 'Live data'}, Status: ${mode}`);
        }
        catch (error) {
            console.error('Failed to fetch live data:', error);
            setLivePositions([]);
            setIsDemoMode(true);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchLiveData();
        setIsRefreshing(false);
    };
    const viewAircraftDetails = (tail) => {
        Alert.alert('Aircraft Details', `Would you like to view detailed information for ${tail}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'View Details', onPress: () => {
                    // Navigate to search with pre-filled tail number
                    Alert.alert('Coming Soon', 'Detailed aircraft view coming soon!');
                } }
        ]);
    };
    const renderHeader = () => (_jsxs(View, { style: styles.header, children: [_jsxs(View, { style: styles.headerContent, children: [_jsx(LiveIcon, { size: 24, color: "#10B981" }), _jsx(Text, { style: styles.headerTitle, children: "Live Aircraft Tracking" })] }), _jsx(TouchableOpacity, { onPress: fetchLiveData, style: styles.refreshButton, children: _jsx(Text, { style: styles.refreshText, children: "\uD83D\uDD04" }) })] }));
    const renderStatusInfo = () => (_jsxs(View, { style: styles.statusContainer, children: [_jsxs(Text, { style: styles.lastUpdateText, children: ["Last update: ", lastUpdate.toLocaleTimeString()] }), isDemoMode && (_jsx(View, { style: styles.demoBadge, children: _jsx(Text, { style: styles.demoText, children: "\uD83D\uDCE1 Demo Data" }) }))] }));
    const renderAircraftPosition = (position) => (_jsxs(TouchableOpacity, { style: styles.positionCard, onPress: () => viewAircraftDetails(position.tail), children: [_jsxs(View, { style: styles.positionHeader, children: [_jsxs(View, { style: styles.positionHeaderLeft, children: [_jsx(PlaneIcon, { size: 20, color: "#2563EB" }), _jsx(Text, { style: styles.positionTail, children: position.tail })] }), _jsx(Text, { style: styles.positionTime, children: new Date(position.ts).toLocaleTimeString() })] }), _jsxs(Text, { style: styles.positionAircraft, children: [position.aircraft?.make, " ", position.aircraft?.model] }), _jsxs(View, { style: styles.positionData, children: [_jsxs(View, { style: styles.positionItem, children: [_jsx(Text, { style: styles.positionLabel, children: "Altitude" }), _jsxs(Text, { style: styles.positionValue, children: [position.alt?.toFixed(0), " ft"] })] }), _jsxs(View, { style: styles.positionItem, children: [_jsx(Text, { style: styles.positionLabel, children: "Speed" }), _jsxs(Text, { style: styles.positionValue, children: [position.speed?.toFixed(0), " kts"] })] }), _jsxs(View, { style: styles.positionItem, children: [_jsx(Text, { style: styles.positionLabel, children: "Heading" }), _jsxs(Text, { style: styles.positionValue, children: [position.heading?.toFixed(0), "\u00B0"] })] })] }), _jsxs(Text, { style: styles.positionCoords, children: ["\uD83D\uDCCD ", position.lat?.toFixed(4), ", ", position.lon?.toFixed(4)] })] }, position.id));
    const renderNoData = () => (_jsxs(View, { style: styles.noDataContainer, children: [_jsx(LiveIcon, { size: 48, color: "#9CA3AF" }), _jsx(Text, { style: styles.noDataText, children: isDemoMode ? 'Demo mode: Using simulated aircraft data' : 'No live aircraft positions available' }), isDemoMode ? (_jsx(Text, { style: styles.demoExplanation, children: "Network connection unavailable. Showing realistic demo data for testing." })) : null, _jsx(TouchableOpacity, { onPress: fetchLiveData, style: styles.retryButton, children: _jsx(Text, { style: styles.retryButtonText, children: "Try Again" }) })] }));
    if (isLoading && livePositions.length === 0) {
        return (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "large", color: "#10B981" }), _jsx(Text, { style: styles.loadingText, children: "Loading live aircraft data..." })] }));
    }
    return (_jsxs(View, { style: styles.container, children: [renderHeader(), renderStatusInfo(), _jsx(ScrollView, { style: styles.scrollView, refreshControl: _jsx(RefreshControl, { refreshing: isRefreshing, onRefresh: handleRefresh }), children: livePositions.length > 0 ? (_jsx(View, { style: styles.positionsContainer, children: livePositions.map(renderAircraftPosition) })) : (renderNoData()) })] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 8,
    },
    refreshButton: {
        padding: 8,
    },
    refreshText: {
        fontSize: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    lastUpdateText: {
        fontSize: 12,
        color: '#6B7280',
    },
    demoBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    demoText: {
        fontSize: 10,
        color: '#92400E',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    positionsContainer: {
        padding: 16,
        gap: 12,
    },
    positionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    positionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    positionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    positionTail: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 8,
    },
    positionTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    positionAircraft: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    positionData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    positionItem: {
        alignItems: 'center',
    },
    positionLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    positionValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    positionCoords: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    noDataContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    demoExplanation: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
    retryButton: {
        backgroundColor: '#10B981',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
