import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FileText, Download, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
export default function ReportsPage() {
    const [reportData, setReportData] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState('overview');
    useEffect(() => {
        fetchReportData();
    }, []);
    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            // Mock data for demonstration - in real app, this would come from API
            const mockData = {
                totalAircraft: 284739,
                aircraftWithAccidents: 15432,
                averageAccidentsPerAircraft: 0.12,
                accidentsByYear: [
                    { year: '2020', count: 1250 },
                    { year: '2021', count: 1180 },
                    { year: '2022', count: 1420 },
                    { year: '2023', count: 1350 },
                    { year: '2024', count: 980 },
                ],
                accidentsBySeverity: [
                    { severity: 'Minor', count: 2450, percentage: 45.2 },
                    { severity: 'Major', count: 1850, percentage: 34.1 },
                    { severity: 'Fatal', count: 1120, percentage: 20.7 },
                ],
                topAircraftTypes: [
                    { make: 'Cessna', model: '172', count: 12450 },
                    { make: 'Piper', model: 'Cherokee', count: 8950 },
                    { make: 'Beechcraft', model: 'Bonanza', count: 6750 },
                    { make: 'Cessna', model: '182', count: 5430 },
                    { make: 'Mooney', model: 'M20', count: 4320 },
                ],
            };
            setReportData(mockData);
        }
        catch (error) {
            console.error('Failed to fetch report data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const exportReport = (format) => {
        // Mock export functionality
        console.log(`Exporting report as ${format}`);
        // In real app, this would generate and download the report
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading report data..." })] }) }));
    }
    if (!reportData) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Failed to Load Report" }), _jsx("p", { className: "text-gray-600", children: "Unable to fetch report data. Please try again later." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(FileText, { className: "h-8 w-8 text-blue-600 mr-2" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "AeroFresh" })] }), _jsxs("nav", { className: "flex space-x-8", children: [_jsx("a", { href: "/", className: "text-gray-600 hover:text-gray-900", children: "Dashboard" }), _jsx("a", { href: "/search", className: "text-gray-600 hover:text-gray-900", children: "Search" }), _jsx("a", { href: "/reports", className: "text-blue-600 font-medium", children: "Reports" })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Aviation Safety Reports" }), _jsx("p", { className: "text-gray-600", children: "Comprehensive analysis of aircraft safety and fleet data" })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsxs("button", { onClick: () => exportReport('pdf'), className: "flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export PDF"] }), _jsxs("button", { onClick: () => exportReport('csv'), className: "flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Export CSV"] })] })] }) }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "flex space-x-8", children: [
                                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                                    { id: 'safety', label: 'Safety Analysis', icon: AlertTriangle },
                                    { id: 'fleet', label: 'Fleet Statistics', icon: TrendingUp },
                                ].map(({ id, label, icon: Icon }) => (_jsxs("button", { onClick: () => setSelectedReport(id), className: `flex items-center py-4 px-1 border-b-2 font-medium text-sm ${selectedReport === id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "h-4 w-4 mr-2" }), label] }, id))) }) }) }), selectedReport === 'overview' && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(BarChart3, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Aircraft" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: reportData.totalAircraft.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center", children: _jsx(AlertTriangle, { className: "h-6 w-6 text-red-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Aircraft with Accidents" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: reportData.aircraftWithAccidents.toLocaleString() })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center", children: _jsx(TrendingUp, { className: "h-6 w-6 text-yellow-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Avg Accidents/Aircraft" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: reportData.averageAccidentsPerAircraft })] })] }) }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "h-6 w-6 text-green-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Safety Rate" }), _jsxs("p", { className: "text-2xl font-bold text-gray-900", children: [((1 - reportData.aircraftWithAccidents / reportData.totalAircraft) * 100).toFixed(1), "%"] })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Accidents by Year" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: reportData.accidentsByYear, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "year" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#3B82F6" })] }) })] })] })), selectedReport === 'safety' && (_jsx("div", { className: "space-y-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Accidents by Severity" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: reportData.accidentsBySeverity, cx: "50%", cy: "50%", labelLine: false, label: ({ severity, percentage }) => `${severity}: ${percentage}%`, outerRadius: 80, fill: "#8884d8", dataKey: "count", children: reportData.accidentsBySeverity.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Safety Recommendations" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "border-l-4 border-red-500 pl-4", children: [_jsx("h4", { className: "font-medium text-gray-900", children: "High Priority" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Focus on ", reportData.accidentsBySeverity[2].count, " fatal accidents requiring immediate attention"] })] }), _jsxs("div", { className: "border-l-4 border-yellow-500 pl-4", children: [_jsx("h4", { className: "font-medium text-gray-900", children: "Medium Priority" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Address ", reportData.accidentsBySeverity[1].count, " major accidents through improved training"] })] }), _jsxs("div", { className: "border-l-4 border-green-500 pl-4", children: [_jsx("h4", { className: "font-medium text-gray-900", children: "Low Priority" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Monitor ", reportData.accidentsBySeverity[0].count, " minor incidents for patterns"] })] })] })] })] }) })), selectedReport === 'fleet' && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Top Aircraft Types" }), _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(BarChart, { data: reportData.topAircraftTypes, layout: "horizontal", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number" }), _jsx(YAxis, { dataKey: "model", type: "category", width: 100 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#10B981" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Fleet Distribution" }), _jsx("div", { className: "space-y-3", children: reportData.topAircraftTypes.map((aircraft, index) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm font-medium text-gray-900", children: [aircraft.make, " ", aircraft.model] }), _jsxs("span", { className: "text-sm text-gray-600", children: [aircraft.count.toLocaleString(), " aircraft"] })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Market Insights" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900", children: "Most Popular Type" }), _jsxs("p", { className: "text-sm text-blue-700", children: [reportData.topAircraftTypes[0].make, " ", reportData.topAircraftTypes[0].model, " dominates the fleet"] })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-green-900", children: "Fleet Growth" }), _jsx("p", { className: "text-sm text-green-700", children: "General aviation aircraft represent the majority of registered aircraft" })] })] })] })] })] }))] })] }));
}
