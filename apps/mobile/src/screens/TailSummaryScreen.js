import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
export default function TailSummaryScreen({ route, navigation }) {
    const { summary, tail } = route.params;
    const getRiskColor = (score) => {
        if (score >= 50)
            return { color: '#DC2626', bg: '#FEE2E2' };
        if (score >= 25)
            return { color: '#D97706', bg: '#FEF3C7' };
        return { color: '#059669', bg: '#D1FAE5' };
    };
    const riskInfo = getRiskColor(summary.riskScore);
    const viewHistory = () => {
        Alert.alert('Coming Soon', 'Detailed aircraft history view coming soon!');
    };
    const getRiskLabel = (score) => {
        if (score >= 50)
            return 'High Risk';
        if (score >= 25)
            return 'Medium Risk';
        return 'Low Risk';
    };
    return (_jsxs(ScrollView, { style: styles.container, contentContainerStyle: styles.contentContainer, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { style: styles.aircraftInfo, children: [_jsx(Text, { style: { fontSize: 32, color: '#3B82F6' }, children: "\u2708\uFE0F" }), _jsxs(View, { style: styles.aircraftDetails, children: [_jsx(Text, { style: styles.tailNumber, children: tail }), _jsx(Text, { style: styles.aircraftType, children: "Aircraft Report" })] })] }), _jsx(View, { style: [styles.riskBadge, { backgroundColor: riskInfo.bg }], children: _jsx(Text, { style: [styles.riskScore, { color: riskInfo.color }], children: getRiskLabel(summary.riskScore) }) })] }), _jsxs(View, { style: styles.metricsContainer, children: [_jsxs(View, { style: styles.metricCard, children: [_jsx(Text, { style: { fontSize: 24, color: '#3B82F6' }, children: "\uD83D\uDCC4" }), _jsx(Text, { style: styles.metricValue, children: summary.regStatus }), _jsx(Text, { style: styles.metricLabel, children: "Registration" })] }), _jsxs(View, { style: styles.metricCard, children: [_jsx(Text, { style: { fontSize: 24, color: '#10B981' }, children: "\u2705" }), _jsx(Text, { style: styles.metricValue, children: summary.airworthiness }), _jsx(Text, { style: styles.metricLabel, children: "Airworthiness" })] }), _jsxs(View, { style: styles.metricCard, children: [_jsx(Text, { style: { fontSize: 24, color: '#F59E0B' }, children: "\u26A0\uFE0F" }), _jsx(Text, { style: styles.metricValue, children: summary.adOpenCount }), _jsx(Text, { style: styles.metricLabel, children: "Open ADs" })] })] }), _jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Safety Information" }), _jsxs(View, { style: styles.safetyGrid, children: [_jsxs(View, { style: styles.safetyCard, children: [_jsx(Text, { style: { fontSize: 20, color: '#DC2626' }, children: "\uD83D\uDEA8" }), _jsx(Text, { style: styles.safetyValue, children: summary.ntsbAccidents }), _jsx(Text, { style: styles.safetyLabel, children: "Accidents" })] }), _jsxs(View, { style: styles.safetyCard, children: [_jsx(Text, { style: { fontSize: 20, color: '#3B82F6' }, children: "\uD83D\uDC65" }), _jsx(Text, { style: styles.safetyValue, children: summary.owners }), _jsx(Text, { style: styles.safetyLabel, children: "Owners" })] }), _jsxs(View, { style: styles.safetyCard, children: [_jsx(Text, { style: { fontSize: 20, color: riskInfo.color }, children: "\uD83D\uDCC8" }), _jsx(Text, { style: [styles.safetyValue, { color: riskInfo.color }], children: summary.riskScore }), _jsx(Text, { style: styles.safetyLabel, children: "Risk Score" })] })] })] }), _jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Risk Assessment" }), _jsxs(View, { style: [styles.riskCard, { backgroundColor: riskInfo.bg }], children: [_jsxs(View, { style: styles.riskHeader, children: [_jsx(Text, { style: { fontSize: 24, color: riskInfo.color }, children: summary.riskScore >= 50 ? "⚠️" : summary.riskScore >= 25 ? "ℹ️" : "✅" }), _jsx(Text, { style: [styles.riskTitle, { color: riskInfo.color }], children: getRiskLabel(summary.riskScore) })] }), _jsx(Text, { style: styles.riskDescription, children: summary.riskScore >= 50
                                    ? "This aircraft has a high risk score due to multiple accidents or open ADs. Exercise caution."
                                    : summary.riskScore >= 25
                                        ? "This aircraft has a moderate risk score. Review safety history before purchase or operation."
                                        : "This aircraft has a low risk score and appears to be in good condition." })] })] }), _jsxs(View, { style: styles.actionsContainer, children: [_jsxs(TouchableOpacity, { style: styles.primaryButton, onPress: viewHistory, children: [_jsx(Text, { style: { fontSize: 20, color: '#fff' }, children: "\uD83D\uDD50" }), _jsx(Text, { style: styles.primaryButtonText, children: "View Full History" })] }), _jsxs(TouchableOpacity, { style: styles.secondaryButton, children: [_jsx(Text, { style: { fontSize: 20, color: '#3B82F6' }, children: "\uD83D\uDCE4" }), _jsx(Text, { style: styles.secondaryButtonText, children: "Share Report" })] })] }), _jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Report Information" }), _jsxs(View, { style: styles.infoCard, children: [_jsxs(View, { style: styles.infoRow, children: [_jsx(Text, { style: styles.infoLabel, children: "Report Generated:" }), _jsx(Text, { style: styles.infoValue, children: new Date().toLocaleDateString() })] }), _jsxs(View, { style: styles.infoRow, children: [_jsx(Text, { style: styles.infoLabel, children: "Data Source:" }), _jsx(Text, { style: styles.infoValue, children: "FAA, NTSB, AD Database" })] }), _jsxs(View, { style: styles.infoRow, children: [_jsx(Text, { style: styles.infoLabel, children: "Last Updated:" }), _jsx(Text, { style: styles.infoValue, children: "Real-time" })] })] })] })] }));
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    aircraftInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aircraftDetails: {
        marginLeft: 12,
    },
    tailNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    aircraftType: {
        fontSize: 14,
        color: '#6B7280',
    },
    riskBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    riskScore: {
        fontSize: 12,
        fontWeight: '600',
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 8,
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    safetyGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    safetyCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    safetyValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 8,
        marginBottom: 4,
    },
    safetyLabel: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    riskCard: {
        padding: 20,
        borderRadius: 12,
    },
    riskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    riskTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    riskDescription: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    secondaryButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    secondaryButtonText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
});
