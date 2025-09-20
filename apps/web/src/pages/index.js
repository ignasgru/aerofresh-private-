import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Plane, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
// Type assertions for React 19 compatibility
const SearchIcon = Search;
const PlaneIcon = Plane;
const AlertTriangleIcon = AlertTriangle;
const MapPinIcon = MapPin;
const CalendarIcon = Calendar;
const LinkComponent = Link;
export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError('Please enter a search term');
            return;
        }
        setIsLoading(true);
        setSearchResults([]);
        setError(null);
        setSuccess(null);
        try {
            console.log('Searching for:', searchTerm);
            const response = await fetch(`http://192.168.3.1:3001/api/search?q=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'x-api-key': 'demo-api-key',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                setError(`Search failed: ${response.status} ${response.statusText}`);
                return;
            }
            const data = await response.json();
            console.log('Search results:', data);
            if (data.results && data.results.length > 0) {
                setSearchResults(data.results);
                setSuccess(`Found ${data.results.length} aircraft matching "${searchTerm}"`);
            }
            else {
                setError(`No aircraft found matching "${searchTerm}"`);
            }
        }
        catch (error) {
            console.error('Search failed:', error);
            setError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-2" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "AeroFresh" })] }), _jsxs("nav", { className: "hidden md:flex space-x-8", children: [_jsx(LinkComponent, { href: "/", className: "text-gray-600 hover:text-gray-900", children: "Dashboard" }), _jsx(LinkComponent, { href: "/search", className: "text-gray-600 hover:text-gray-900", children: "Advanced Search" }), _jsx(LinkComponent, { href: "/live-tracking", className: "text-gray-600 hover:text-gray-900", children: "Live Tracking" }), _jsx(LinkComponent, { href: "/reports", className: "text-gray-600 hover:text-gray-900", children: "Reports" })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Aircraft Information Platform" }), _jsx("p", { className: "text-xl text-gray-600 mb-8", children: "Get comprehensive aircraft history, safety records, and ownership information" }), _jsx("div", { className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "flex", children: [_jsx("input", { type: "text", placeholder: "Enter tail number (e.g., N123AB) or aircraft make/model", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500", onKeyPress: (e) => e.key === 'Enter' && handleSearch() }), _jsx("button", { onClick: handleSearch, disabled: isLoading, className: "px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center", "aria-label": "Search aircraft", children: isLoading ? (_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" })) : (_jsx(SearchIcon, { className: "h-5 w-5" })) })] }) })] }), error && (_jsx(ErrorMessage, { message: error, onClose: () => setError(null) })), success && (_jsx(SuccessMessage, { message: success, onClose: () => setSuccess(null) })), (isLoading || searchResults.length > 0 || error) && (_jsxs("div", { className: "mb-12", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6", children: isLoading ? 'Searching...' : 'Search Results' }), isLoading ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Searching for aircraft..." })] })) : searchResults.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: searchResults.map((aircraft) => (_jsxs(LinkComponent, { href: `/aircraft/${aircraft.tail}`, className: "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-3" }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900", children: aircraft.tail }), _jsxs("p", { className: "text-sm text-gray-600", children: [aircraft.make, " ", aircraft.model] })] })] }), _jsx("div", { className: "text-sm text-gray-500", children: _jsxs("p", { children: ["Year: ", aircraft.year || 'Unknown'] }) })] }, aircraft.tail))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(PlaneIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "No aircraft found. Try a different search term." })] }))] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx(AlertTriangleIcon, { className: "h-12 w-12 text-red-500 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Safety Records" }), _jsx("p", { className: "text-gray-600", children: "Access comprehensive NTSB accident reports and safety incident history for any aircraft." })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx(MapPinIcon, { className: "h-12 w-12 text-green-500 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Live Tracking" }), _jsx("p", { className: "text-gray-600", children: "Track aircraft in real-time with live position data and flight information." })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx(CalendarIcon, { className: "h-12 w-12 text-blue-500 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Ownership History" }), _jsx("p", { className: "text-gray-600", children: "View complete ownership history and registration details for any aircraft." })] })] })] })] }));
}
