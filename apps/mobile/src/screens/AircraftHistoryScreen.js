import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function AircraftHistoryScreen({ route, navigation }) {
    const { tail } = route.params;
    const [historyData, setHistoryData] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('owners');
    useEffect(() => {
        fetchHistoryData();
    }, [tail]);
    const fetchHistoryData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/aircraft/${tail}/history`);
            if (!response.ok) {
                Alert.alert('Error', 'Failed to fetch aircraft history');
                return;
            }
            const data = await response.json();
            setHistoryData(data.history);
        }
        catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch aircraft history. Please check your connection.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'fatal':
                return '#DC2626';
            case 'major':
                return '#D97706';
            case 'minor':
                return '#059669';
            default:
                return '#6B7280';
        }
    };
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return '#DC2626';
            case 'closed':
                return '#059669';
            case 'applicable':
                return '#D97706';
            default:
                return '#6B7280';
        }
    };
    if (loading) {
        return (_jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "large", color: "#3B82F6" }), _jsx(Text, { style: styles.loadingText, children: "Loading aircraft history..." })] }));
    }
    if (!historyData) {
        return (_jsxs(View, { style: styles.errorContainer, children: [_jsx(Ionicons, { name: "alert-circle", size: 48, color: "#DC2626" }), _jsx(Text, { style: styles.errorTitle, children: "Unable to Load History" }), _jsx(Text, { style: styles.errorText, children: "Failed to fetch aircraft history data." }), _jsx(TouchableOpacity, { style: styles.retryButton, onPress: fetchHistoryData, children: _jsx(Text, { style: styles.retryButtonText, children: "Retry" }) })] }));
    }
    return (_jsxs(View, { style: styles.container, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { style: styles.aircraftInfo, children: [_jsx(Ionicons, { name: "airplane", size: 24, color: "#3B82F6" }), _jsx(Text, { style: styles.tailNumber, children: tail })] }), _jsx(Text, { style: styles.headerSubtitle, children: "Aircraft History" })] }), _jsxs(View, { style: styles.tabContainer, children: [_jsxs(TouchableOpacity, { style: [styles.tab, activeTab === 'owners' && styles.activeTab], onPress: () => setActiveTab('owners'), children: [_jsx(Ionicons, { name: "people", size: 16, color: activeTab === 'owners' ? '#3B82F6' : '#6B7280' }), _jsxs(Text, { style: [styles.tabText, activeTab === 'owners' && styles.activeTabText], children: ["Owners (", historyData.owners.length, ")"] })] }), _jsxs(TouchableOpacity, { style: [styles.tab, activeTab === 'accidents' && styles.activeTab], onPress: () => setActiveTab('accidents'), children: [_jsx(Ionicons, { name: "warning", size: 16, color: activeTab === 'accidents' ? '#3B82F6' : '#6B7280' }), _jsxs(Text, { style: [styles.tabText, activeTab === 'accidents' && styles.activeTabText], children: ["Accidents (", historyData.accidents.length, ")"] })] }), _jsxs(TouchableOpacity, { style: [styles.tab, activeTab === 'ads' && styles.activeTab], onPress: () => setActiveTab('ads'), children: [_jsx(Ionicons, { name: "document-text", size: 16, color: activeTab === 'ads' ? '#3B82F6' : '#6B7280' }), _jsxs(Text, { style: [styles.tabText, activeTab === 'ads' && styles.activeTabText], children: ["ADs (", historyData.adDirectives.length, ")"] })] })] }), _jsxs(ScrollView, { style: styles.content, showsVerticalScrollIndicator: false, children: [activeTab === 'owners' && (_jsx(View, { style: styles.tabContent, children: historyData.owners.length > 0 ? (historyData.owners.map((owner, index) => (_jsxs(View, { style: styles.ownerCard, children: [_jsxs(View, { style: styles.ownerHeader, children: [_jsx(Ionicons, { name: "person", size: 20, color: "#3B82F6" }), _jsx(Text, { style: styles.ownerName, children: owner.owner.name })] }), _jsxs(View, { style: styles.ownerDetails, children: [_jsx(Text, { style: styles.ownerType, children: owner.owner.type }), _jsxs(Text, { style: styles.ownerLocation, children: [owner.owner.state, ", ", owner.owner.country] })] }), _jsxs(View, { style: styles.ownerPeriod, children: [_jsxs(Text, { style: styles.periodText, children: [new Date(owner.startDate).toLocaleDateString(), owner.endDate && ` - ${new Date(owner.endDate).toLocaleDateString()}`] }), !owner.endDate && (_jsx(Text, { style: styles.currentOwner, children: "Current Owner" }))] })] }, index)))) : (_jsxs(View, { style: styles.emptyState, children: [_jsx(Ionicons, { name: "people-outline", size: 48, color: "#9CA3AF" }), _jsx(Text, { style: styles.emptyStateText, children: "No ownership history available" })] })) })), activeTab === 'accidents' && (_jsx(View, { style: styles.tabContent, children: historyData.accidents.length > 0 ? (historyData.accidents.map((accident, index) => (_jsxs(View, { style: styles.accidentCard, children: [_jsxs(View, { style: styles.accidentHeader, children: [_jsxs(View, { style: styles.accidentDate, children: [_jsx(Ionicons, { name: "calendar", size: 16, color: "#6B7280" }), _jsx(Text, { style: styles.dateText, children: new Date(accident.date).toLocaleDateString() })] }), _jsx(View, { style: [styles.severityBadge, { backgroundColor: getSeverityColor(accident.severity) + '20' }], children: _jsx(Text, { style: [styles.severityText, { color: getSeverityColor(accident.severity) }], children: accident.severity }) })] }), accident.narrative && (_jsx(Text, { style: styles.accidentNarrative, children: accident.narrative })), _jsxs(View, { style: styles.accidentStats, children: [accident.fatalities && accident.fatalities > 0 && (_jsxs(View, { style: styles.statItem, children: [_jsx(Ionicons, { name: "close-circle", size: 16, color: "#DC2626" }), _jsxs(Text, { style: styles.statText, children: [accident.fatalities, " fatalities"] })] })), accident.injuries && accident.injuries > 0 && (_jsxs(View, { style: styles.statItem, children: [_jsx(Ionicons, { name: "medical", size: 16, color: "#F59E0B" }), _jsxs(Text, { style: styles.statText, children: [accident.injuries, " injuries"] })] }))] })] }, index)))) : (_jsxs(View, { style: styles.emptyState, children: [_jsx(Ionicons, { name: "checkmark-circle", size: 48, color: "#059669" }), _jsx(Text, { style: styles.emptyStateText, children: "No accidents recorded" }), _jsx(Text, { style: styles.emptyStateSubtext, children: "This aircraft has a clean safety record" })] })) })), activeTab === 'ads' && (_jsx(View, { style: styles.tabContent, children: historyData.adDirectives.length > 0 ? (historyData.adDirectives.map((ad, index) => (_jsxs(View, { style: styles.adCard, children: [_jsxs(View, { style: styles.adHeader, children: [_jsx(Text, { style: styles.adRef, children: ad.ref }), _jsx(View, { style: [styles.statusBadge, { backgroundColor: getStatusColor(ad.status) + '20' }], children: _jsx(Text, { style: [styles.statusText, { color: getStatusColor(ad.status) }], children: ad.status }) })] }), _jsx(Text, { style: styles.adSummary, children: ad.summary }), _jsxs(View, { style: styles.adDetails, children: [_jsxs(Text, { style: styles.adDate, children: ["Effective: ", new Date(ad.effectiveDate).toLocaleDateString()] }), _jsxs(Text, { style: styles.adSeverity, children: ["Severity: ", ad.severity] })] })] }, index)))) : (_jsxs(View, { style: styles.emptyState, children: [_jsx(Ionicons, { name: "checkmark-circle", size: 48, color: "#059669" }), _jsx(Text, { style: styles.emptyStateText, children: "No AD directives" }), _jsx(Text, { style: styles.emptyStateSubtext, children: "No airworthiness directives apply to this aircraft" })] })) }))] })] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 20,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    aircraftInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    tailNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginLeft: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#3B82F6',
    },
    tabText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    activeTabText: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: 16,
    },
    ownerCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    ownerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ownerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 8,
    },
    ownerDetails: {
        marginBottom: 8,
    },
    ownerType: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    ownerLocation: {
        fontSize: 14,
        color: '#6B7280',
    },
    ownerPeriod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    periodText: {
        fontSize: 12,
        color: '#6B7280',
    },
    currentOwner: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '600',
    },
    accidentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
    },
    accidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    accidentDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '600',
    },
    accidentNarrative: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
        lineHeight: 20,
    },
    accidentStats: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    adCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    adHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    adRef: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    adSummary: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
        lineHeight: 20,
    },
    adDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    adDate: {
        fontSize: 12,
        color: '#6B7280',
    },
    adSeverity: {
        fontSize: 12,
        color: '#6B7280',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 4,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
});
