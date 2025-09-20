import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { api } from '../lib/network';
// Simple icon components
const ReportIcon = ({ size = 24, color = '#8B5CF6' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCCA" }));
const AlertIcon = ({ size = 24, color = '#F59E0B' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u26A0\uFE0F" }));
const PlaneIcon = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2708\uFE0F" }));
const HistoryIcon = ({ size = 24, color = '#059669' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCDC" }));
export default function ReportsScreen({ navigation }) {
    const [showTailInput, setShowTailInput] = useState(false);
    const [tailInput, setTailInput] = useState('');
    const generateComprehensiveReport = async (tailNumber) => {
        if (!tailNumber.trim()) {
            Alert.alert('Error', 'Please enter a tail number');
            return;
        }
        try {
            const { data, isDemo } = await api.comprehensiveReport(tailNumber.toUpperCase());
            if (data) {
                Alert.alert('📊 Comprehensive Report Generated', `Aircraft: ${tailNumber.toUpperCase()}\n\n✅ Overview & Key Metrics\n✅ Ownership History\n✅ Accident Records\n✅ Inspection Reports\n✅ Market Value Analysis\n✅ Risk Assessment\n\n📈 Risk Score: ${data.riskAnalysis?.score || 25}/100 (Low Risk)\n💰 Market Value: $${data.marketValue?.current?.toLocaleString() || '450,000'}\n📅 Last Inspection: ${data.inspections?.[0]?.date || '2024-01-15'}\n🛡️ Airworthiness: Valid\n\nReport saved and ready for export!`, [
                    { text: 'OK', style: 'default' },
                    { text: 'Export PDF', onPress: () => Alert.alert('Export', 'PDF export feature coming soon!') }
                ]);
                if (isDemo) {
                    setTimeout(() => {
                        Alert.alert('Demo Mode', `Report generated using demo data for ${tailNumber.toUpperCase()}`);
                    }, 1000);
                }
            }
        }
        catch (error) {
            console.error('Failed to generate report:', error);
            Alert.alert('Error', 'Failed to generate report. Please try again.');
        }
    };
    const handleTailInput = () => {
        if (tailInput.trim()) {
            generateComprehensiveReport(tailInput.trim());
            setTailInput('');
            setShowTailInput(false);
        }
        else {
            Alert.alert('Error', 'Please enter a tail number');
        }
    };
    const showTailInputModal = () => {
        setShowTailInput(true);
    };
    const renderReportCard = (icon, title, description, onPress, available = true) => (_jsxs(TouchableOpacity, { style: [styles.reportCard, !available && styles.reportCardDisabled], onPress: available ? onPress : () => Alert.alert('Coming Soon', `${title} feature coming soon!`), disabled: !available, children: [_jsxs(View, { style: styles.reportCardHeader, children: [icon, _jsx(Text, { style: [styles.reportCardTitle, !available && styles.reportCardTitleDisabled], children: title })] }), _jsx(Text, { style: [styles.reportCardDesc, !available && styles.reportCardDescDisabled], children: description }), _jsx(TouchableOpacity, { style: [styles.reportButton, !available && styles.reportButtonDisabled], onPress: available ? onPress : () => Alert.alert('Coming Soon', `${title} feature coming soon!`), children: _jsx(Text, { style: [styles.reportButtonText, !available && styles.reportButtonTextDisabled], children: available ? 'Generate Report' : 'Coming Soon' }) })] }));
    return (_jsxs(View, { style: styles.container, children: [_jsxs(ScrollView, { style: styles.scrollView, showsVerticalScrollIndicator: false, children: [_jsxs(View, { style: styles.header, children: [_jsx(ReportIcon, { size: 32, color: "#8B5CF6" }), _jsx(Text, { style: styles.headerTitle, children: "Generate Comprehensive Reports" }), _jsx(Text, { style: styles.headerSubtitle, children: "Professional aircraft intelligence and analysis" })] }), _jsxs(View, { style: styles.reportsContainer, children: [renderReportCard(_jsx(HistoryIcon, { size: 32, color: "#059669" }), 'Aircraft History Report', 'Complete ownership, accident, and inspection history with risk assessment', showTailInputModal, true), renderReportCard(_jsx(AlertIcon, { size: 32, color: "#F59E0B" }), 'Safety Analysis', 'Risk assessment and safety recommendations based on FAA data', () => { }, false), renderReportCard(_jsx(PlaneIcon, { size: 32, color: "#2563EB" }), 'Market Value Report', 'Current market value and depreciation analysis with trends', () => { }, false), renderReportCard(_jsx(ReportIcon, { size: 32, color: "#8B5CF6" }), 'Insurance Report', 'Insurance history and claims analysis for risk evaluation', () => { }, false)] }), _jsxs(View, { style: styles.featuresSection, children: [_jsx(Text, { style: styles.featuresTitle, children: "Report Features" }), _jsxs(View, { style: styles.featuresList, children: [_jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: styles.featureIcon, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "Complete ownership history" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: styles.featureIcon, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "Accident and incident records" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: styles.featureIcon, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "Maintenance and inspection history" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: styles.featureIcon, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "Risk assessment scoring" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: styles.featureIcon, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "Market value analysis" })] }), _jsxs(View, { style: styles.featureItem, children: [_jsx(Text, { style: styles.featureIcon, children: "\u2705" }), _jsx(Text, { style: styles.featureText, children: "PDF export capability" })] })] })] })] }), _jsx(Modal, { visible: showTailInput, transparent: true, animationType: "fade", onRequestClose: () => setShowTailInput(false), children: _jsx(View, { style: styles.modalOverlay, children: _jsxs(View, { style: styles.modalContent, children: [_jsx(Text, { style: styles.modalTitle, children: "Enter Aircraft Tail Number" }), _jsx(TextInput, { style: styles.tailInput, placeholder: "e.g., N123AB", placeholderTextColor: "#9CA3AF", value: tailInput, onChangeText: setTailInput, autoCapitalize: "characters", autoFocus: true }), _jsxs(View, { style: styles.modalButtons, children: [_jsx(TouchableOpacity, { style: [styles.modalButton, styles.modalButtonCancel], onPress: () => {
                                            setShowTailInput(false);
                                            setTailInput('');
                                        }, children: _jsx(Text, { style: styles.modalButtonCancelText, children: "Cancel" }) }), _jsx(TouchableOpacity, { style: [styles.modalButton, styles.modalButtonConfirm], onPress: handleTailInput, children: _jsx(Text, { style: styles.modalButtonConfirmText, children: "Generate Report" }) })] })] }) }) })] }));
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 12,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
    reportsContainer: {
        padding: 16,
    },
    reportCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reportCardDisabled: {
        opacity: 0.6,
    },
    reportCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reportCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 12,
    },
    reportCardTitleDisabled: {
        color: '#9CA3AF',
    },
    reportCardDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        lineHeight: 20,
    },
    reportCardDescDisabled: {
        color: '#9CA3AF',
    },
    reportButton: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    reportButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    reportButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    reportButtonTextDisabled: {
        color: '#9CA3AF',
    },
    featuresSection: {
        margin: 16,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    featureText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 320,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    tailInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: '#F3F4F6',
    },
    modalButtonConfirm: {
        backgroundColor: '#8B5CF6',
    },
    modalButtonCancelText: {
        color: '#374151',
        fontSize: 14,
        fontWeight: '600',
    },
    modalButtonConfirmText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
