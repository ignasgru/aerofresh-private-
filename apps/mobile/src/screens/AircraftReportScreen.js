import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
// Simple icon components to avoid lucide-react-native dependency issues
const ArrowLeft = ({ size = 24, color = '#374151' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2190" }));
const Plane = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2708" }));
const AlertTriangle = ({ size = 24, color = '#D97706' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u26A0" }));
const Users = ({ size = 24, color = '#7C3AED' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDC65" }));
const Shield = ({ size = 24, color = '#2563EB' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDEE1" }));
const DollarSign = ({ size = 24, color = '#059669' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCB0" }));
const Wrench = ({ size = 24, color = '#6B7280' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDD27" }));
const Calendar = ({ size = 24, color = '#6B7280' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\uD83D\uDCC5" }));
const CheckCircle = ({ size = 24, color = '#059669' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u2705" }));
const XCircle = ({ size = 24, color = '#DC2626' }) => (_jsx(Text, { style: { fontSize: size, color }, children: "\u274C" }));
const AircraftReportScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { tail } = route.params;
    const [summary, setSummary] = useState(null);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    // Mock data for demonstration
    const [inspectionReports] = useState([
        {
            id: 'INSP-2024-001',
            date: '2024-01-15',
            inspector: 'John Smith, A&P',
            type: 'Annual',
            status: 'Passed',
            hours: 2847,
            issues: [
                {
                    severity: 'Minor',
                    description: 'Minor paint chipping on left wing tip',
                    resolved: true
                }
            ]
        }
    ]);
    const [marketValue] = useState({
        current: 185000,
        range: { low: 165000, high: 205000 },
        trend: 'up',
        factors: [
            {
                factor: 'Low Flight Hours',
                impact: 'positive',
                description: 'Below average flight hours for aircraft age'
            },
            {
                factor: 'Recent Annual',
                impact: 'positive',
                description: 'Fresh annual inspection with no major issues'
            }
        ]
    });
    useEffect(() => {
        fetchAircraftData();
    }, []);
    const fetchAircraftData = async () => {
        try {
            const headers = {
                'x-api-key': 'demo-api-key',
                'Content-Type': 'application/json',
            };
            // Use static data for mobile app
            const mockSummary = {
                tail: tail,
                regStatus: 'Valid',
                airworthiness: 'Airworthy',
                adOpenCount: 1,
                ntsbAccidents: 0,
                owners: 2,
                riskScore: 25,
                aircraft: {
                    tail: tail,
                    make: 'Cessna',
                    model: '172',
                    year: 2015,
                    engine: 'Lycoming O-360',
                    seats: 4
                }
            };
            const mockHistory = {
                owners: [
                    {
                        owner: {
                            name: "John Smith Aviation LLC",
                            type: "Corporation",
                            state: "CA",
                            country: "USA"
                        },
                        startDate: "2020-03-15",
                        endDate: undefined
                    }
                ],
                accidents: [],
                adDirectives: []
            };
            setSummary(mockSummary);
            setHistory(mockHistory);
        }
        catch (error) {
            console.error('Failed to fetch aircraft data:', error);
            Alert.alert('Error', 'Failed to load aircraft data');
        }
        finally {
            setLoading(false);
        }
    };
    const getRiskColor = (score) => {
        if (score < 30)
            return { color: '#059669', backgroundColor: '#D1FAE5' };
        if (score < 60)
            return { color: '#D97706', backgroundColor: '#FEF3C7' };
        return { color: '#DC2626', backgroundColor: '#FEE2E2' };
    };
    const getRiskLevel = (score) => {
        if (score < 30)
            return 'Low Risk';
        if (score < 60)
            return 'Medium Risk';
        return 'High Risk';
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const getSeverityColor = (severity) => {
        switch (severity.toLowerCase()) {
            case 'critical': return { color: '#DC2626', backgroundColor: '#FEE2E2' };
            case 'major': return { color: '#EA580C', backgroundColor: '#FED7AA' };
            case 'minor': return { color: '#D97706', backgroundColor: '#FEF3C7' };
            default: return { color: '#6B7280', backgroundColor: '#F3F4F6' };
        }
    };
    if (loading) {
        return (_jsx(SafeAreaView, { style: styles.container, children: _jsxs(View, { style: styles.loadingContainer, children: [_jsx(ActivityIndicator, { size: "large", color: "#2563EB" }), _jsx(Text, { style: styles.loadingText, children: "Loading aircraft report..." })] }) }));
    }
    if (!summary) {
        return (_jsx(SafeAreaView, { style: styles.container, children: _jsxs(View, { style: styles.errorContainer, children: [_jsx(Text, { style: styles.errorTitle, children: "Aircraft Not Found" }), _jsxs(Text, { style: styles.errorText, children: ["The aircraft with tail number \"", tail, "\" was not found."] }), _jsx(TouchableOpacity, { style: styles.backButton, onPress: () => navigation.goBack(), children: _jsx(Text, { style: styles.backButtonText, children: "Back to Search" }) })] }) }));
    }
    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📄' },
        { id: 'history', label: 'History', icon: '📅' },
        { id: 'inspections', label: 'Inspections', icon: '🔧' },
        { id: 'market', label: 'Market', icon: '💰' },
        { id: 'risk', label: 'Risk', icon: '🛡️' },
    ];
    const renderOverview = () => (_jsxs(View, { style: styles.tabContent, children: [_jsxs(View, { style: styles.metricsGrid, children: [_jsxs(View, { style: styles.metricCard, children: [_jsx(CheckCircle, { size: 24, color: "#059669" }), _jsx(Text, { style: styles.metricLabel, children: "Registration" }), _jsx(Text, { style: styles.metricValue, children: summary.regStatus })] }), _jsxs(View, { style: styles.metricCard, children: [_jsx(Shield, { size: 24, color: "#2563EB" }), _jsx(Text, { style: styles.metricLabel, children: "Airworthiness" }), _jsx(Text, { style: styles.metricValue, children: summary.airworthiness })] }), _jsxs(View, { style: styles.metricCard, children: [_jsx(AlertTriangle, { size: 24, color: "#D97706" }), _jsx(Text, { style: styles.metricLabel, children: "Open ADs" }), _jsx(Text, { style: styles.metricValue, children: summary.adOpenCount })] }), _jsxs(View, { style: styles.metricCard, children: [_jsx(Users, { size: 24, color: "#7C3AED" }), _jsx(Text, { style: styles.metricLabel, children: "Owners" }), _jsx(Text, { style: styles.metricValue, children: summary.owners })] })] }), _jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Aircraft Details" }), _jsxs(View, { style: styles.detailsGrid, children: [_jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Tail Number" }), _jsx(Text, { style: styles.detailValue, children: summary.aircraft.tail })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Make & Model" }), _jsxs(Text, { style: styles.detailValue, children: [summary.aircraft.make, " ", summary.aircraft.model] })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Year" }), _jsx(Text, { style: styles.detailValue, children: summary.aircraft.year })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Engine" }), _jsx(Text, { style: styles.detailValue, children: summary.aircraft.engine || 'N/A' })] }), _jsxs(View, { style: styles.detailRow, children: [_jsx(Text, { style: styles.detailLabel, children: "Seats" }), _jsx(Text, { style: styles.detailValue, children: summary.aircraft.seats || 'N/A' })] })] })] })] }));
    const renderHistory = () => (_jsx(View, { style: styles.tabContent, children: history && (_jsxs(_Fragment, { children: [_jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Ownership History" }), history.owners.map((owner, index) => (_jsxs(View, { style: styles.ownerCard, children: [_jsx(Text, { style: styles.ownerName, children: owner.owner.name }), _jsxs(Text, { style: styles.ownerDetails, children: [owner.owner.type, " \u2022 ", owner.owner.state, ", ", owner.owner.country] }), _jsxs(Text, { style: styles.ownerDate, children: ["From: ", owner.startDate, owner.endDate && ` To: ${owner.endDate}`] })] }, index)))] }), history.accidents.length > 0 && (_jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Accident History" }), history.accidents.map((accident, index) => (_jsxs(View, { style: styles.accidentCard, children: [_jsxs(View, { style: styles.accidentHeader, children: [_jsx(Text, { style: styles.accidentDate, children: new Date(accident.date).toLocaleDateString() }), _jsx(View, { style: [styles.severityBadge, { backgroundColor: getSeverityColor(accident.severity).backgroundColor }], children: _jsx(Text, { style: [styles.severityText, { color: getSeverityColor(accident.severity).color }], children: accident.severity }) })] }), accident.narrative && (_jsx(Text, { style: styles.accidentNarrative, children: accident.narrative })), (accident.injuries || accident.fatalities) && (_jsxs(Text, { style: styles.accidentStats, children: [accident.injuries && `Injuries: ${accident.injuries} `, accident.fatalities && `Fatalities: ${accident.fatalities}`] }))] }, index)))] }))] })) }));
    const renderInspections = () => (_jsx(View, { style: styles.tabContent, children: inspectionReports.map((report) => (_jsxs(View, { style: styles.detailsCard, children: [_jsxs(View, { style: styles.reportHeader, children: [_jsx(Text, { style: styles.cardTitle, children: report.id }), _jsx(View, { style: [
                                styles.statusBadge,
                                { backgroundColor: report.status === 'Passed' ? '#D1FAE5' : '#FEE2E2' }
                            ], children: _jsx(Text, { style: [
                                    styles.statusText,
                                    { color: report.status === 'Passed' ? '#059669' : '#DC2626' }
                                ], children: report.status }) })] }), _jsxs(View, { style: styles.reportDetails, children: [_jsxs(Text, { style: styles.reportDetail, children: ["Date: ", report.date] }), _jsxs(Text, { style: styles.reportDetail, children: ["Inspector: ", report.inspector] }), _jsxs(Text, { style: styles.reportDetail, children: ["Type: ", report.type] }), _jsxs(Text, { style: styles.reportDetail, children: ["Hours: ", report.hours.toLocaleString()] })] }), report.issues.length > 0 && (_jsxs(View, { style: styles.issuesSection, children: [_jsx(Text, { style: styles.issuesTitle, children: "Issues Found" }), report.issues.map((issue, index) => (_jsxs(View, { style: styles.issueRow, children: [issue.resolved ? (_jsx(CheckCircle, { size: 16, color: "#059669" })) : (_jsx(XCircle, { size: 16, color: "#DC2626" })), _jsx(View, { style: [
                                        styles.issueSeverity,
                                        { backgroundColor: getSeverityColor(issue.severity).backgroundColor }
                                    ], children: _jsx(Text, { style: [
                                            styles.issueSeverityText,
                                            { color: getSeverityColor(issue.severity).color }
                                        ], children: issue.severity }) }), _jsx(Text, { style: styles.issueDescription, children: issue.description })] }, index)))] }))] }, report.id))) }));
    const renderMarket = () => (_jsxs(View, { style: styles.tabContent, children: [_jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Market Value Analysis" }), _jsxs(View, { style: styles.valueContainer, children: [_jsx(Text, { style: styles.currentValue, children: formatCurrency(marketValue.current) }), _jsxs(Text, { style: styles.valueRange, children: ["Range: ", formatCurrency(marketValue.range.low), " - ", formatCurrency(marketValue.range.high)] }), _jsx(Text, { style: [
                                    styles.valueTrend,
                                    { color: marketValue.trend === 'up' ? '#059669' : '#DC2626' }
                                ], children: marketValue.trend === 'up' ? '📈 Increasing Value' : '📉 Decreasing Value' })] })] }), _jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Value Factors" }), marketValue.factors.map((factor, index) => (_jsxs(View, { style: styles.factorRow, children: [_jsx(View, { style: [
                                    styles.factorDot,
                                    { backgroundColor: factor.impact === 'positive' ? '#059669' : '#DC2626' }
                                ] }), _jsxs(View, { style: styles.factorContent, children: [_jsx(Text, { style: styles.factorName, children: factor.factor }), _jsx(Text, { style: styles.factorDescription, children: factor.description })] })] }, index)))] })] }));
    const renderRisk = () => (_jsxs(View, { style: styles.tabContent, children: [_jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Risk Assessment" }), _jsxs(View, { style: styles.riskContainer, children: [_jsx(View, { style: [
                                    styles.riskScore,
                                    { backgroundColor: getRiskColor(summary.riskScore).backgroundColor }
                                ], children: _jsxs(Text, { style: [
                                        styles.riskScoreText,
                                        { color: getRiskColor(summary.riskScore).color }
                                    ], children: [summary.riskScore, "/100"] }) }), _jsx(Text, { style: styles.riskLevel, children: getRiskLevel(summary.riskScore) })] })] }), _jsxs(View, { style: styles.detailsCard, children: [_jsx(Text, { style: styles.cardTitle, children: "Risk Factors" }), _jsxs(View, { style: styles.riskFactor, children: [_jsx(Text, { style: styles.riskFactorLabel, children: "Accident History" }), _jsx(View, { style: styles.riskBar, children: _jsx(View, { style: [styles.riskBarFill, {
                                            width: `${summary.ntsbAccidents * 20}%`,
                                            backgroundColor: '#DC2626'
                                        }] }) }), _jsx(Text, { style: styles.riskFactorValue, children: summary.ntsbAccidents })] }), _jsxs(View, { style: styles.riskFactor, children: [_jsx(Text, { style: styles.riskFactorLabel, children: "Open ADs" }), _jsx(View, { style: styles.riskBar, children: _jsx(View, { style: [styles.riskBarFill, {
                                            width: `${summary.adOpenCount * 25}%`,
                                            backgroundColor: '#D97706'
                                        }] }) }), _jsx(Text, { style: styles.riskFactorValue, children: summary.adOpenCount })] }), _jsxs(View, { style: styles.riskFactor, children: [_jsx(Text, { style: styles.riskFactorLabel, children: "Ownership Stability" }), _jsx(View, { style: styles.riskBar, children: _jsx(View, { style: [styles.riskBarFill, {
                                            width: `${Math.max(0, 100 - summary.owners * 10)}%`,
                                            backgroundColor: '#059669'
                                        }] }) }), _jsxs(Text, { style: styles.riskFactorValue, children: [summary.owners, " owners"] })] })] })] }));
    return (_jsxs(SafeAreaView, { style: styles.container, children: [_jsxs(View, { style: styles.header, children: [_jsx(TouchableOpacity, { onPress: () => navigation.goBack(), style: styles.backButton, children: _jsx(ArrowLeft, { size: 24, color: "#374151" }) }), _jsxs(View, { style: styles.headerContent, children: [_jsx(Plane, { size: 28, color: "#2563EB" }), _jsxs(View, { style: styles.headerText, children: [_jsx(Text, { style: styles.headerTitle, children: summary.aircraft.tail }), _jsxs(Text, { style: styles.headerSubtitle, children: [summary.aircraft.make, " ", summary.aircraft.model, " (", summary.aircraft.year, ")"] })] })] }), _jsx(View, { style: styles.riskBadge, children: _jsx(Text, { style: [
                                styles.riskBadgeText,
                                { color: getRiskColor(summary.riskScore).color }
                            ], children: getRiskLevel(summary.riskScore) }) })] }), _jsx(View, { style: styles.tabContainer, children: _jsx(ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, children: tabs.map((tab) => (_jsxs(TouchableOpacity, { onPress: () => setActiveTab(tab.id), style: [
                            styles.tab,
                            activeTab === tab.id && styles.activeTab
                        ], children: [_jsx(Text, { style: styles.tabIcon, children: tab.icon }), _jsx(Text, { style: [
                                    styles.tabLabel,
                                    activeTab === tab.id && styles.activeTabLabel
                                ], children: tab.label })] }, tab.id))) }) }), _jsxs(ScrollView, { style: styles.content, children: [activeTab === 'overview' && renderOverview(), activeTab === 'history' && renderHistory(), activeTab === 'inspections' && renderInspections(), activeTab === 'market' && renderMarket(), activeTab === 'risk' && renderRisk()] })] }));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        padding: 20,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginRight: 12,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerText: {
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    riskBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
    },
    riskBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    tabContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#2563EB',
    },
    tabIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabLabel: {
        color: '#2563EB',
    },
    content: {
        flex: 1,
    },
    tabContent: {
        padding: 16,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    metricCard: {
        width: '48%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        marginRight: '2%',
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 8,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    detailsGrid: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    ownerCard: {
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 6,
        marginBottom: 8,
    },
    ownerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    ownerDetails: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    ownerDate: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    accidentCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
        paddingLeft: 12,
        marginBottom: 12,
    },
    accidentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    accidentDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
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
        color: '#6B7280',
        marginBottom: 4,
    },
    accidentStats: {
        fontSize: 14,
        color: '#6B7280',
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
    reportDetails: {
        gap: 4,
        marginBottom: 16,
    },
    reportDetail: {
        fontSize: 14,
        color: '#6B7280',
    },
    issuesSection: {
        marginTop: 16,
    },
    issuesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    issueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    issueSeverity: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
        marginRight: 8,
    },
    issueSeverityText: {
        fontSize: 10,
        fontWeight: '600',
    },
    issueDescription: {
        fontSize: 14,
        color: '#111827',
        flex: 1,
    },
    valueContainer: {
        alignItems: 'center',
    },
    currentValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    valueRange: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    valueTrend: {
        fontSize: 14,
        fontWeight: '600',
    },
    factorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    factorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    factorContent: {
        flex: 1,
    },
    factorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    factorDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    riskContainer: {
        alignItems: 'center',
    },
    riskScore: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    riskScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    riskLevel: {
        fontSize: 14,
        color: '#6B7280',
    },
    riskFactor: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    riskFactorLabel: {
        fontSize: 14,
        color: '#111827',
        width: 120,
    },
    riskBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginHorizontal: 12,
    },
    riskBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    riskFactorValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        width: 40,
        textAlign: 'right',
    },
});
export default AircraftReportScreen;
