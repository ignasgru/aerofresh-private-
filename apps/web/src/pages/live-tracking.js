import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { MapPin, Plane, RefreshCw, Filter, Clock } from 'lucide-react';
import Link from 'next/link';
// Type assertions for React 19 compatibility
const MapPinIcon = MapPin;
const PlaneIcon = Plane;
const RefreshCwIcon = RefreshCw;
const FilterIcon = Filter;
const ClockIcon = Clock;
const LinkComponent = Link;
export default function LiveTracking() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        limit: 50,
        minutes: 30,
        latMin: '',
        latMax: '',
        lonMin: '',
        lonMax: ''
    });
    const [viewMode, setViewMode] = useState('all');
    const fetchLiveData = async () => {
        setLoading(true);
        setError(null);
        try {
            let url = 'http://192.168.3.1:3001/api/tracking/live';
            const params = new URLSearchParams();
            if (viewMode === 'all') {
                params.append('limit', filters.limit.toString());
                params.append('minutes', filters.minutes.toString());
            }
            else {
                url = 'http://192.168.3.1:3001/api/tracking/region';
                params.append('limit', filters.limit.toString());
                if (filters.latMin)
                    params.append('latMin', filters.latMin);
                if (filters.latMax)
                    params.append('latMax', filters.latMax);
                if (filters.lonMin)
                    params.append('lonMin', filters.lonMin);
                if (filters.lonMax)
                    params.append('lonMax', filters.lonMax);
            }
            const response = await fetch(`${url}?${params.toString()}`, {
                headers: {
                    'x-api-key': 'demo-api-key',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
        }
        catch (error) {
            console.error('Failed to fetch live data:', error);
            setError(`Failed to fetch live data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchLiveData();
    }, []);
    const formatAltitude = (alt) => {
        return `${Math.round(alt * 3.28084)} ft`; // Convert meters to feet
    };
    const formatSpeed = (speed) => {
        return `${Math.round(speed * 1.94384)} kts`; // Convert m/s to knots
    };
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };
    const getCardinalDirection = (heading) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(heading / 45) % 8;
        return directions[index];
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex items-center", children: _jsxs(LinkComponent, { href: "/", className: "flex items-center", children: [_jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-2" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "AeroFresh" })] }) }), _jsxs("nav", { className: "hidden md:flex space-x-8", children: [_jsx(LinkComponent, { href: "/", className: "text-gray-600 hover:text-gray-900", children: "Dashboard" }), _jsx(LinkComponent, { href: "/search", className: "text-gray-600 hover:text-gray-900", children: "Search" }), _jsx(LinkComponent, { href: "/live-tracking", className: "text-blue-600 font-semibold", children: "Live Tracking" })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Live Aircraft Tracking" }), _jsx("p", { className: "text-gray-600", children: "Real-time aircraft positions from ADS-B data sources" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 mb-8", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FilterIcon, { className: "h-5 w-5 text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "View Mode:" }), _jsxs("select", { value: viewMode, onChange: (e) => setViewMode(e.target.value), className: "border border-gray-300 rounded-md px-3 py-1 text-sm", "aria-label": "Select view mode", children: [_jsx("option", { value: "all", children: "All Aircraft" }), _jsx("option", { value: "region", children: "Regional View" })] })] }), viewMode === 'all' && (_jsx(_Fragment, { children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(ClockIcon, { className: "h-5 w-5 text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Time Range:" }), _jsxs("select", { value: filters.minutes, onChange: (e) => setFilters({ ...filters, minutes: parseInt(e.target.value) }), className: "border border-gray-300 rounded-md px-3 py-1 text-sm", "aria-label": "Select time range", children: [_jsx("option", { value: 5, children: "5 minutes" }), _jsx("option", { value: 15, children: "15 minutes" }), _jsx("option", { value: 30, children: "30 minutes" }), _jsx("option", { value: 60, children: "1 hour" }), _jsx("option", { value: 120, children: "2 hours" })] })] }) })), viewMode === 'region' && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPinIcon, { className: "h-5 w-5 text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Region:" }), _jsx("input", { type: "number", placeholder: "Lat Min", value: filters.latMin, onChange: (e) => setFilters({ ...filters, latMin: e.target.value }), className: "border border-gray-300 rounded-md px-2 py-1 text-sm w-20" }), _jsx("input", { type: "number", placeholder: "Lat Max", value: filters.latMax, onChange: (e) => setFilters({ ...filters, latMax: e.target.value }), className: "border border-gray-300 rounded-md px-2 py-1 text-sm w-20" }), _jsx("input", { type: "number", placeholder: "Lon Min", value: filters.lonMin, onChange: (e) => setFilters({ ...filters, lonMin: e.target.value }), className: "border border-gray-300 rounded-md px-2 py-1 text-sm w-20" }), _jsx("input", { type: "number", placeholder: "Lon Max", value: filters.lonMax, onChange: (e) => setFilters({ ...filters, lonMax: e.target.value }), className: "border border-gray-300 rounded-md px-2 py-1 text-sm w-20" })] })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Limit:" }), _jsxs("select", { value: filters.limit, onChange: (e) => setFilters({ ...filters, limit: parseInt(e.target.value) }), className: "border border-gray-300 rounded-md px-3 py-1 text-sm", "aria-label": "Select number of results to display", children: [_jsx("option", { value: 25, children: "25" }), _jsx("option", { value: 50, children: "50" }), _jsx("option", { value: 100, children: "100" }), _jsx("option", { value: 200, children: "200" })] })] }), _jsxs("button", { onClick: fetchLiveData, disabled: loading, className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2", children: [_jsx(RefreshCwIcon, { className: `h-4 w-4 ${loading ? 'animate-spin' : ''}` }), _jsx("span", { children: loading ? 'Loading...' : 'Refresh' })] })] }), data && (_jsxs("div", { className: "text-sm text-gray-600", children: ["Showing ", data.count, " aircraft \u2022 Last updated: ", formatTime(data.lastUpdate), " \u2022 Time range: ", data.timeRange] }))] }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6", children: error })), loading && !data && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading live aircraft data..." })] })), data && data.positions.length > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: data.positions.map((position) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(PlaneIcon, { className: "h-6 w-6 text-blue-600 mr-2" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: position.tail }), position.aircraft && (_jsxs("p", { className: "text-sm text-gray-600", children: [position.aircraft.make, " ", position.aircraft.model, " (", position.aircraft.year, ")"] }))] })] }), _jsx(LinkComponent, { href: `/aircraft/${position.tail}`, className: "text-blue-600 hover:text-blue-800 text-sm font-medium", children: "View Details" })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Position:" }), _jsxs("span", { className: "font-mono", children: [position.lat.toFixed(4), ", ", position.lon.toFixed(4)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Altitude:" }), _jsx("span", { children: formatAltitude(position.alt) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Speed:" }), _jsx("span", { children: formatSpeed(position.speed) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Heading:" }), _jsxs("span", { children: [position.heading.toFixed(0), "\u00B0 ", getCardinalDirection(position.heading)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Last Update:" }), _jsx("span", { children: formatTime(position.ts) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Source:" }), _jsx("span", { className: "capitalize", children: position.src })] })] })] }, position.id))) })), data && data.positions.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(PlaneIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No Aircraft Found" }), _jsx("p", { className: "text-gray-600", children: "No aircraft positions found for the selected criteria. Try adjusting your filters." })] }))] })] }));
}
