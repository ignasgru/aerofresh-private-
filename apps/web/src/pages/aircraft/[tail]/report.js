import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plane, AlertTriangle, Users, MapPin, Calendar, FileText, Shield, TrendingUp, DollarSign, Wrench, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
// Type assertions for React 19 compatibility
const ArrowLeftIcon = ArrowLeft;
const PlaneIcon = Plane;
const AlertTriangleIcon = AlertTriangle;
const UsersIcon = Users;
const MapPinIcon = MapPin;
const CalendarIcon = Calendar;
const FileTextIcon = FileText;
const ShieldIcon = Shield;
const TrendingUpIcon = TrendingUp;
const DollarSignIcon = DollarSign;
const WrenchIcon = Wrench;
const ClockIcon = Clock;
const CheckCircleIcon = CheckCircle;
const XCircleIcon = XCircle;
const StarIcon = Star;
const LinkComponent = Link;
export default function AircraftReport({ initialSummary, initialHistory, tail: propTail }) {
    const router = useRouter();
    const { tail: tailParam } = router.query;
    const aircraftTail = Array.isArray(tailParam) ? tailParam[0] : tailParam || propTail;
    const [summary, setSummary] = useState(initialSummary || null);
    const [history, setHistory] = useState(initialHistory || null);
    const [loading, setLoading] = useState(!initialSummary);
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
            ],
            notes: 'Aircraft in excellent condition. All systems operational.'
        },
        {
            id: 'INSP-2023-002',
            date: '2023-01-10',
            inspector: 'Mike Johnson, IA',
            type: 'Annual',
            status: 'Passed',
            hours: 2698,
            issues: [],
            notes: 'Routine annual inspection completed successfully.'
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
            },
            {
                factor: 'Accident History',
                impact: 'negative',
                description: 'One minor accident in 2019'
            }
        ],
        comparableSales: [
            {
                tail: 'N456CD',
                year: 2015,
                price: 192000,
                date: '2024-01-20'
            },
            {
                tail: 'N789EF',
                year: 2014,
                price: 178000,
                date: '2023-12-15'
            }
        ]
    });
    useEffect(() => {
        if (router.isReady && aircraftTail && !summary) {
            fetchAircraftData(aircraftTail);
        }
    }, [router.isReady, aircraftTail, summary]);
    const fetchAircraftData = async (currentAircraftTail) => {
        try {
            const headers = {
                'x-api-key': 'demo-api-key',
                'Content-Type': 'application/json',
            };
            const [summaryRes, historyRes] = await Promise.all([
                fetch(`http://192.168.3.1:3001/api/aircraft/${currentAircraftTail}/summary`, { headers }),
                fetch(`http://192.168.3.1:3001/api/aircraft/${currentAircraftTail}/history`, { headers })
            ]);
            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                setSummary(summaryData.summary);
            }
            if (historyRes.ok) {
                const historyData = await historyRes.json();
                setHistory(historyData.history);
            }
        }
        catch (error) {
            console.error('Failed to fetch aircraft data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getRiskColor = (score) => {
        if (score < 30)
            return 'text-green-600 bg-green-100';
        if (score < 60)
            return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
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
            case 'critical': return 'text-red-600 bg-red-100';
            case 'major': return 'text-orange-600 bg-orange-100';
            case 'minor': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading aircraft report..." })] }) }));
    }
    if (!summary) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Aircraft Not Found" }), _jsxs("p", { className: "text-gray-600 mb-8", children: ["The aircraft with tail number \"", aircraftTail, "\" was not found."] }), _jsx(LinkComponent, { href: "/", className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700", children: "Back to Search" })] }) }));
    }
    const tabs = [
        { id: 'overview', label: 'Overview', icon: FileTextIcon },
        { id: 'history', label: 'History', icon: CalendarIcon },
        { id: 'inspections', label: 'Inspections', icon: WrenchIcon },
        { id: 'market', label: 'Market Value', icon: DollarSignIcon },
        { id: 'risk', label: 'Risk Analysis', icon: ShieldIcon },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(LinkComponent, { href: "/", className: "mr-4", children: _jsx(ArrowLeftIcon, { className: "h-6 w-6 text-gray-600 hover:text-gray-900" }) }), _jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-3" }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: summary.aircraft.tail }), _jsxs("p", { className: "text-sm text-gray-600", children: [summary.aircraft.make, " ", summary.aircraft.model, " (", summary.aircraft.year, ")"] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(summary.riskScore)}`, children: getRiskLevel(summary.riskScore) }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-gray-600", children: "Risk Score" }), _jsxs("div", { className: "text-xl font-bold text-gray-900", children: [summary.riskScore, "/100"] })] })] })] }) }) }), _jsx("div", { className: "bg-white border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("nav", { className: "flex space-x-8", children: tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { children: tab.label })] }, tab.id));
                        }) }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [activeTab === 'overview' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(CheckCircleIcon, { className: "h-8 w-8 text-green-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Registration Status" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: summary.regStatus })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(ShieldIcon, { className: "h-8 w-8 text-blue-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Airworthiness" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: summary.airworthiness })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(AlertTriangleIcon, { className: "h-8 w-8 text-orange-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Open ADs" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: summary.adOpenCount })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(UsersIcon, { className: "h-8 w-8 text-purple-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "Owners" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: summary.owners })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Aircraft Details" }) }), _jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Tail Number" }), _jsx("div", { className: "text-sm text-gray-900", children: summary.aircraft.tail })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Make & Model" }), _jsxs("div", { className: "text-sm text-gray-900", children: [summary.aircraft.make, " ", summary.aircraft.model] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Year" }), _jsx("div", { className: "text-sm text-gray-900", children: summary.aircraft.year })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Engine" }), _jsx("div", { className: "text-sm text-gray-900", children: summary.aircraft.engine || 'N/A' })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Seats" }), _jsx("div", { className: "text-sm text-gray-900", children: summary.aircraft.seats || 'N/A' })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Serial Number" }), _jsx("div", { className: "text-sm text-gray-900", children: summary.aircraft.serial || 'N/A' })] })] }) })] })] })), activeTab === 'history' && history && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Ownership History" }) }), _jsx("div", { className: "px-6 py-4", children: _jsx("div", { className: "flow-root", children: _jsx("ul", { className: "-mb-8", children: history.owners.map((owner, index) => (_jsx("li", { children: _jsxs("div", { className: "relative pb-8", children: [index !== history.owners.length - 1 && (_jsx("span", { className: "absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200", "aria-hidden": "true" })), _jsxs("div", { className: "relative flex space-x-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center", children: _jsx(UsersIcon, { className: "h-4 w-4 text-white" }) }), _jsxs("div", { className: "min-w-0 flex-1 pt-1.5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: owner.owner.name }), _jsxs("p", { className: "text-sm text-gray-500", children: [owner.owner.type, " \u2022 ", owner.owner.state, ", ", owner.owner.country] })] }), _jsxs("div", { className: "mt-2 text-sm text-gray-700", children: [_jsxs("p", { children: ["From: ", owner.startDate] }), owner.endDate && _jsxs("p", { children: ["To: ", owner.endDate] })] })] })] })] }) }, index))) }) }) })] }), history.accidents.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Accident History" }) }), _jsx("div", { className: "px-6 py-4", children: _jsx("div", { className: "space-y-4", children: history.accidents.map((accident, index) => (_jsxs("div", { className: "border-l-4 border-red-400 pl-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: new Date(accident.date).toLocaleDateString() }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${accident.severity === 'FATAL' ? 'bg-red-100 text-red-800' :
                                                                    accident.severity === 'SERIOUS' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-yellow-100 text-yellow-800'}`, children: accident.severity })] }), accident.narrative && (_jsx("p", { className: "mt-1 text-sm text-gray-600", children: accident.narrative })), _jsxs("div", { className: "mt-2 text-sm text-gray-500", children: [accident.injuries && _jsxs("span", { children: ["Injuries: ", accident.injuries, " "] }), accident.fatalities && _jsxs("span", { children: ["Fatalities: ", accident.fatalities, " "] }), accident.phase && _jsxs("span", { children: ["Phase: ", accident.phase] })] })] }, index))) }) })] }))] })), activeTab === 'inspections' && (_jsx("div", { className: "space-y-6", children: inspectionReports.map((report) => (_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: report.id }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${report.status === 'Passed' ? 'bg-green-100 text-green-800' :
                                                    report.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`, children: report.status })] }) }), _jsxs("div", { className: "px-6 py-4", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Date" }), _jsx("div", { className: "text-sm text-gray-900", children: report.date })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Inspector" }), _jsx("div", { className: "text-sm text-gray-900", children: report.inspector })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Type" }), _jsx("div", { className: "text-sm text-gray-900", children: report.type })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Hours" }), _jsx("div", { className: "text-sm text-gray-900", children: report.hours.toLocaleString() })] })] }), report.issues.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-2", children: "Issues Found" }), _jsx("div", { className: "space-y-2", children: report.issues.map((issue, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [issue.resolved ? (_jsx(CheckCircleIcon, { className: "h-4 w-4 text-green-500" })) : (_jsx(XCircleIcon, { className: "h-4 w-4 text-red-500" })), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`, children: issue.severity }), _jsx("span", { className: "text-sm text-gray-900", children: issue.description })] }, index))) })] })), report.notes && (_jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-2", children: "Notes" }), _jsx("p", { className: "text-sm text-gray-700", children: report.notes })] }))] })] }, report.id))) })), activeTab === 'market' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Market Value Analysis" }) }), _jsx("div", { className: "px-6 py-6", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl font-bold text-gray-900 mb-2", children: formatCurrency(marketValue.current) }), _jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(TrendingUpIcon, { className: `h-5 w-5 ${marketValue.trend === 'up' ? 'text-green-500' : 'text-red-500'}` }), _jsxs("span", { className: `text-sm font-medium ${marketValue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`, children: [marketValue.trend === 'up' ? 'Increasing' : 'Decreasing', " Value"] })] }), _jsxs("div", { className: "mt-2 text-sm text-gray-500", children: ["Range: ", formatCurrency(marketValue.range.low), " - ", formatCurrency(marketValue.range.high)] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Value Factors" }) }), _jsx("div", { className: "px-6 py-4", children: _jsx("div", { className: "space-y-4", children: marketValue.factors.map((factor, index) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${factor.impact === 'positive' ? 'bg-green-500' :
                                                            factor.impact === 'negative' ? 'bg-red-500' :
                                                                'bg-gray-500'}` }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: factor.factor }), _jsx("p", { className: "text-sm text-gray-600", children: factor.description })] })] }, index))) }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Comparable Sales" }) }), _jsx("div", { className: "px-6 py-4", children: _jsx("div", { className: "space-y-4", children: marketValue.comparableSales.map((sale, index) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: sale.tail }), _jsxs("p", { className: "text-sm text-gray-500", children: [sale.year, " \u2022 ", sale.date] })] }), _jsx("div", { className: "text-right", children: _jsx("p", { className: "text-sm font-medium text-gray-900", children: formatCurrency(sale.price) }) })] }, index))) }) })] })] })), activeTab === 'risk' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Risk Assessment" }) }), _jsx("div", { className: "px-6 py-6", children: _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: `inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getRiskColor(summary.riskScore)}`, children: [summary.riskScore, "/100"] }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: getRiskLevel(summary.riskScore) })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200", children: _jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Risk Factors" }) }), _jsx("div", { className: "px-6 py-4", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-900", children: "Accident History" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-16 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `bg-red-500 h-2 rounded-full ${summary.ntsbAccidents > 0 ? 'w-1/5' : 'w-0'}` }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: summary.ntsbAccidents })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-900", children: "Open ADs" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-16 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `bg-yellow-500 h-2 rounded-full ${summary.adOpenCount > 0 ? 'w-1/4' : 'w-0'}` }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: summary.adOpenCount })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-900", children: "Ownership Stability" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-16 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `bg-green-500 h-2 rounded-full ${summary.owners <= 3 ? 'w-3/4' : summary.owners <= 5 ? 'w-1/2' : 'w-1/4'}` }) }), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: [summary.owners, " owners"] })] })] })] }) })] })] }))] })] }));
}
export const getServerSideProps = async (context) => {
    const { tail } = context.params;
    const tailString = Array.isArray(tail) ? tail[0] : tail;
    try {
        const headers = {
            'x-api-key': 'demo-api-key',
            'Content-Type': 'application/json',
        };
        const [summaryRes, historyRes] = await Promise.all([
            fetch(`http://192.168.3.1:3001/api/aircraft/${tailString}/summary`, { headers }),
            fetch(`http://192.168.3.1:3001/api/aircraft/${tailString}/history`, { headers })
        ]);
        let initialSummary = null;
        let initialHistory = null;
        if (summaryRes.ok) {
            const summaryData = await summaryRes.json();
            initialSummary = summaryData.summary;
        }
        if (historyRes.ok) {
            const historyData = await historyRes.json();
            initialHistory = historyData.history;
        }
        return {
            props: {
                initialSummary,
                initialHistory,
                tail: tailString,
            },
        };
    }
    catch (error) {
        console.error('Failed to fetch aircraft data:', error);
        return {
            props: {
                initialSummary: null,
                initialHistory: null,
                tail: tailString,
            },
        };
    }
};
