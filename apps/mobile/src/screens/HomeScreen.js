import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { api } from '../lib/network';
// Simple icon components
const PlaneIcon = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2708\uFE0F" }));
const SearchIcon = ({ size = 24, color = '#6B7280' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDD0D" }));
const LiveIcon = ({ size = 24, color = '#10B981' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCE1" }));
const ReportIcon = ({ size = 24, color = '#8B5CF6' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCCA" }));
const TrendingIcon = ({ size = 24, color = '#F59E0B' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCC8" }));
export default function HomeScreen({ navigation }) {
    const [networkStatus, setNetworkStatus] = useState('checking');
    const [recentSearches, setRecentSearches] = useState([]);
    const [livePositions, setLivePositions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    // Initial load and network status check
    useEffect(() => {
        loadDashboardData();
    }, []);
    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            // Check network status
            const healthStatus = await api.health();
            setNetworkStatus(healthStatus);
            // Load live positions for dashboard
            const { data: liveData } = await api.livePositions(5, 30);
            setLivePositions(liveData.positions || []);
            // Load recent searches (demo data for now)
            setRecentSearches([
                { tail: 'N123AB', make: 'Cessna', model: '172', year: 2020, riskScore: 15 },
                { tail: 'N456CD', make: 'Piper', model: 'Cherokee', year: 2018, riskScore: 20 },
            ]);
        }
        catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadDashboardData();
        setIsRefreshing(false);
    };
    const quickSearch = (tailNumber) => {
        navigation.navigate('Search');
        // Simulate search after navigation
        setTimeout(() => {
            Alert.alert('Quick Search', `Searching for ${tailNumber}...`);
        }, 100);
    };
    const renderNetworkStatus = () => (_jsx(View, { style: [styles.statusCard,
            networkStatus === 'online' ? styles.statusOnline :
                networkStatus === 'offline' ? styles.statusOffline : styles.statusChecking], children: _jsxs(View, { style: styles.statusContent, children: [_jsx(Text, { style: styles.statusIcon, children: networkStatus === 'online' ? '🟢' :
                        networkStatus === 'offline' ? '🔴' : '🟡' }), _jsxs(View, { style: styles.statusText, children: [_jsx(Text, { style: styles.statusTitle, children: networkStatus === 'online' ? 'Online' :
                                networkStatus === 'offline' ? 'Offline Mode' : 'Checking...' }), _jsx(Text, { style: styles.statusSubtitle, children: networkStatus === 'online' ? 'Live data available' :
                                networkStatus === 'offline' ? 'Using demo data' : 'Connecting to servers...' })] })] }) }));
    const renderQuickActions = () => (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Quick Actions" }), _jsxs(View, { style: styles.actionsGrid, children: [_jsxs(TouchableOpacity, { style: styles.actionCard, onPress: () => navigation.navigate('Search'), children: [_jsx(SearchIcon, { size: 32, color: "#2563EB" }), _jsx(Text, { style: styles.actionTitle, children: "Search Aircraft" }), _jsx(Text, { style: styles.actionSubtitle, children: "Find aircraft by tail number" })] }), _jsxs(TouchableOpacity, { style: styles.actionCard, onPress: () => navigation.navigate('LiveTracking'), children: [_jsx(LiveIcon, { size: 32, color: "#10B981" }), _jsx(Text, { style: styles.actionTitle, children: "Live Tracking" }), _jsx(Text, { style: styles.actionSubtitle, children: "Real-time aircraft positions" })] }), _jsxs(TouchableOpacity, { style: styles.actionCard, onPress: () => navigation.navigate('Reports'), children: [_jsx(ReportIcon, { size: 32, color: "#8B5CF6" }), _jsx(Text, { style: styles.actionTitle, children: "Generate Report" }), _jsx(Text, { style: styles.actionSubtitle, children: "Comprehensive aircraft history" })] }), _jsxs(TouchableOpacity, { style: styles.actionCard, onPress: () => Alert.alert('Coming Soon', 'Market analysis feature coming soon!'), children: [_jsx(TrendingIcon, { size: 32, color: "#F59E0B" }), _jsx(Text, { style: styles.actionTitle, children: "Market Analysis" }), _jsx(Text, { style: styles.actionSubtitle, children: "Value trends & insights" })] })] })] }));
    const renderRecentSearches = () => (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: styles.sectionTitle, children: "Recent Searches" }), _jsx(TouchableOpacity, { onPress: () => navigation.navigate('Search'), children: _jsx(Text, { style: styles.seeAllText, children: "See All" }) })] }), _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, children: recentSearches.map((aircraft, index) => (_jsxs(TouchableOpacity, { style: styles.aircraftCard, onPress: () => quickSearch(aircraft.tail), children: [_jsxs(View, { style: styles.aircraftHeader, children: [_jsx(PlaneIcon, { size: 20, color: "#2563EB" }), _jsx(Text, { style: styles.aircraftTail, children: aircraft.tail })] }), _jsxs(Text, { style: styles.aircraftInfo, children: [aircraft.make, " ", aircraft.model] }), _jsx(Text, { style: styles.aircraftYear, children: aircraft.year })] }, index))) })] }));
    const renderLivePositions = () => (_jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.sectionHeader, children: [_jsx(Text, { style: styles.sectionTitle, children: "Live Aircraft" }), _jsx(TouchableOpacity, { onPress: () => navigation.navigate('LiveTracking'), children: _jsx(Text, { style: styles.seeAllText, children: "See All" }) })] }), livePositions.slice(0, 3).map((position) => (_jsxs(TouchableOpacity, { style: styles.positionCard, onPress: () => navigation.navigate('LiveTracking'), children: [_jsxs(View, { style: styles.positionHeader, children: [_jsx(Text, { style: styles.positionTail, children: position.tail }), _jsx(Text, { style: styles.positionTime, children: new Date(position.ts).toLocaleTimeString() })] }), _jsxs(Text, { style: styles.positionAircraft, children: [position.aircraft?.make, " ", position.aircraft?.model] }), _jsxs(View, { style: styles.positionData, children: [_jsxs(Text, { style: styles.positionItem, children: ["Alt: ", position.alt?.toFixed(0), " ft"] }), _jsxs(Text, { style: styles.positionItem, children: ["Speed: ", position.speed?.toFixed(0), " kts"] })] })] }, position.id)))] }));
    if (isLoading) {
        return (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "large", color: "#2563EB" }), _jsx(Text, { style: styles.loadingText, children: "Loading AeroFresh..." })] }));
    }
    return (_jsxs(ScrollView, { style: styles.container, refreshControl: _jsx(RefreshControl, { refreshing: isRefreshing, onRefresh: handleRefresh }), children: [renderNetworkStatus(), renderQuickActions(), renderRecentSearches(), renderLivePositions()] }));
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
    section: {
        margin: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    seeAllText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    statusCard: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusOnline: {
        backgroundColor: '#D1FAE5',
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    statusOffline: {
        backgroundColor: '#FEE2E2',
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
    },
    statusChecking: {
        backgroundColor: '#FEF3C7',
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    statusContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    statusText: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        backgroundColor: 'white',
        width: '48%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 8,
        textAlign: 'center',
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
    aircraftCard: {
        backgroundColor: 'white',
        width: 140,
        padding: 12,
        borderRadius: 8,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    aircraftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    aircraftTail: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 4,
    },
    aircraftInfo: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    aircraftYear: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    positionCard: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    positionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    positionTail: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    positionTime: {
        fontSize: 11,
        color: '#6B7280',
    },
    positionAircraft: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    positionData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    positionItem: {
        fontSize: 11,
        color: '#9CA3AF',
    },
});
