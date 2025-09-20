import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plane, AlertTriangle, Users, MapPin, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
// Type assertions for React 19 compatibility
const ArrowLeftIcon = ArrowLeft;
const PlaneIcon = Plane;
const AlertTriangleIcon = AlertTriangle;
const UsersIcon = Users;
const MapPinIcon = MapPin;
const CalendarIcon = Calendar;
const FileTextIcon = FileText;
const LinkComponent = Link;
export default function AircraftDetail({ initialSummary, initialHistory, tail: propTail }) {
    const router = useRouter();
    const { tail: tailParam } = router.query;
    const aircraftTail = Array.isArray(tailParam) ? tailParam[0] : tailParam || propTail;
    const [summary, setSummary] = useState(initialSummary || null);
    const [history, setHistory] = useState(initialHistory || null);
    const [activeTab, setActiveTab] = useState('summary');
    const [loading, setLoading] = useState(!initialSummary);
    useEffect(() => {
        console.log('useEffect triggered, router ready:', router.isReady, 'tail:', aircraftTail);
        // Extract tail from URL manually as fallback
        const urlTail = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null;
        const testTail = aircraftTail || urlTail || 'N123AB';
        console.log('Using tail:', testTail);
        if (testTail) {
            fetchAircraftData(testTail);
        }
        else {
            console.log('No tail parameter, setting loading to false');
            setLoading(false);
        }
    }, [router.isReady, aircraftTail]);
    const fetchAircraftData = async (aircraftTail) => {
        try {
            const headers = {
                'x-api-key': 'demo-api-key',
                'Content-Type': 'application/json',
            };
            console.log('Fetching aircraft data for:', aircraftTail);
            const [summaryRes, historyRes] = await Promise.all([
                fetch(`http://192.168.3.1:3001/api/aircraft/${aircraftTail}/summary`, { headers }),
                fetch(`http://192.168.3.1:3001/api/aircraft/${aircraftTail}/history`, { headers })
            ]);
            console.log('Summary response status:', summaryRes.status);
            console.log('History response status:', historyRes.status);
            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                console.log('Summary data:', summaryData);
                setSummary(summaryData.summary);
            }
            else {
                console.error('Summary request failed:', summaryRes.status, summaryRes.statusText);
            }
            if (historyRes.ok) {
                const historyData = await historyRes.json();
                console.log('History data:', historyData);
                setHistory(historyData.history);
            }
            else {
                console.error('History request failed:', historyRes.status, historyRes.statusText);
            }
        }
        catch (error) {
            console.error('Failed to fetch aircraft data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading aircraft data..." }), _jsxs("p", { className: "mt-2 text-sm text-gray-500", children: ["Tail: ", aircraftTail || 'undefined'] }), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["Router ready: ", router.isReady ? 'true' : 'false'] }), _jsx("button", { onClick: () => {
                            console.log('Button clicked, forcing data load');
                            fetchAircraftData('N123AB');
                        }, className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Force Load Data" })] }) }));
    }
    if (!summary) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Aircraft Not Found" }), _jsxs("p", { className: "text-gray-600 mb-8", children: ["The aircraft with tail number \"", aircraftTail, "\" was not found in our database."] }), _jsx(LinkComponent, { href: "/", className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700", children: "Back to Search" })] }) }));
    }
    const getRiskColor = (score) => {
        if (score >= 50)
            return 'text-red-600 bg-red-100';
        if (score >= 25)
            return 'text-yellow-600 bg-yellow-100';
        return 'text-green-600 bg-green-100';
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center h-16", children: [_jsxs(LinkComponent, { href: "/", className: "flex items-center text-gray-600 hover:text-gray-900 mr-6", children: [_jsx(ArrowLeftIcon, { className: "h-5 w-5 mr-2" }), "Back to Search"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-3" }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: summary.tail }), _jsx("p", { className: "text-sm text-gray-600", children: "Aircraft Report" })] })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(FileTextIcon, { className: "h-8 w-8 text-blue-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Registration" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: summary.regStatus })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(AlertTriangleIcon, { className: "h-8 w-8 text-red-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Accidents" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: summary.ntsbAccidents })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx(UsersIcon, { className: "h-8 w-8 text-green-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Owners" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: summary.owners })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center", children: _jsx("span", { className: "text-xs font-bold", children: "RS" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Risk Score" }), _jsx("p", { className: `text-lg font-semibold px-2 py-1 rounded-full ${getRiskColor(summary.riskScore)}`, children: summary.riskScore })] })] }) })] }), _jsx("div", { className: "flex justify-end space-x-4 mb-6", children: _jsxs(LinkComponent, { href: `/aircraft/${aircraftTail}/report`, className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2", children: [_jsx(FileTextIcon, { className: "h-4 w-4" }), _jsx("span", { children: "Comprehensive Report" })] }) }), _jsxs("div", { className: "bg-white rounded-lg shadow-md", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "flex space-x-8 px-6", children: [
                                        { id: 'summary', label: 'Summary', icon: FileText },
                                        { id: 'history', label: 'History', icon: Calendar },
                                        { id: 'live', label: 'Live Data', icon: MapPin },
                                    ].map(({ id, label, icon: Icon }) => (_jsxs("button", { onClick: () => setActiveTab(id), className: `flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "h-4 w-4 mr-2" }), label] }, id))) }) }), _jsxs("div", { className: "p-6", children: [activeTab === 'summary' && (_jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Aircraft Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Registration Status" }), _jsx("p", { className: "font-medium", children: summary.regStatus })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Airworthiness" }), _jsx("p", { className: "font-medium", children: summary.airworthiness })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Open AD Directives" }), _jsx("p", { className: "font-medium", children: summary.adOpenCount })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "NTSB Accidents" }), _jsx("p", { className: "font-medium", children: summary.ntsbAccidents })] })] })] }) })), activeTab === 'history' && history && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Ownership History" }), _jsx("div", { className: "space-y-4", children: history.owners.map((owner, index) => (_jsx("div", { className: "border-l-4 border-blue-500 pl-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: owner.owner.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [owner.owner.type, " \u2022 ", owner.owner.state, ", ", owner.owner.country] })] }), _jsx("div", { className: "text-right", children: _jsxs("p", { className: "text-sm text-gray-600", children: [new Date(owner.startDate).toLocaleDateString(), owner.endDate && ` - ${new Date(owner.endDate).toLocaleDateString()}`] }) })] }) }, index))) })] }), history.accidents.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Accident History" }), _jsx("div", { className: "space-y-4", children: history.accidents.map((accident, index) => (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: new Date(accident.date).toLocaleDateString() }), _jsx("span", { className: "px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full", children: accident.severity })] }), accident.narrative && (_jsx("p", { className: "text-sm text-gray-700 mb-2", children: accident.narrative })), _jsxs("div", { className: "flex space-x-4 text-xs text-gray-600", children: [accident.fatalities && _jsxs("span", { children: ["Fatalities: ", accident.fatalities] }), accident.injuries && _jsxs("span", { children: ["Injuries: ", accident.injuries] })] })] }, index))) })] })), history.adDirectives.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Airworthiness Directives" }), _jsx("div", { className: "space-y-4", children: history.adDirectives.map((ad, index) => (_jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-medium text-gray-900", children: ad.ref }), _jsx("span", { className: `px-2 py-1 text-xs rounded-full ${ad.status === 'OPEN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`, children: ad.status })] }), _jsx("p", { className: "text-sm text-gray-700 mb-2", children: ad.summary }), _jsxs("p", { className: "text-xs text-gray-600", children: ["Effective: ", new Date(ad.effectiveDate).toLocaleDateString()] })] }, index))) })] }))] })), activeTab === 'live' && (_jsxs("div", { className: "text-center py-12", children: [_jsx(MapPinIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Live Tracking" }), _jsx("p", { className: "text-gray-600", children: "Live tracking data is not currently available for this aircraft." })] }))] })] })] })] }));
}
export const getServerSideProps = async (context) => {
    const { tail } = context.params;
    try {
        const headers = {
            'x-api-key': 'demo-api-key',
            'Content-Type': 'application/json',
        };
        const [summaryRes, historyRes] = await Promise.all([
            fetch(`http://192.168.3.1:3001/api/aircraft/${tail}/summary`, { headers }),
            fetch(`http://192.168.3.1:3001/api/aircraft/${tail}/history`, { headers })
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
                tail,
                initialSummary,
                initialHistory,
            },
        };
    }
    catch (error) {
        console.error('Failed to fetch aircraft data on server:', error);
        return {
            props: {
                tail,
                initialSummary: null,
                initialHistory: null,
            },
        };
    }
};
