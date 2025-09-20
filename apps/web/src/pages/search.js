import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, Filter, Plane, X } from 'lucide-react';
import Link from 'next/link';
// Type assertions for React 19 compatibility
const SearchIcon = Search;
const FilterIcon = Filter;
const PlaneIcon = Plane;
const XIcon = X;
const LinkComponent = Link;
export default function SearchPage() {
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        year: '',
        hasAccidents: '',
        minYear: '',
        maxYear: '',
    });
    const [results, setResults] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            // Use our working API server
            const searchQuery = filters.make || filters.model || '';
            const params = new URLSearchParams();
            if (searchQuery)
                params.append('q', searchQuery);
            if (filters.make)
                params.append('make', filters.make);
            if (filters.model)
                params.append('model', filters.model);
            if (filters.year)
                params.append('year', filters.year);
            if (filters.hasAccidents)
                params.append('hasAccidents', filters.hasAccidents);
            const response = await fetch(`http://192.168.3.1:3001/api/search?${params.toString()}`, {
                headers: {
                    'x-api-key': 'demo-api-key',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setResults(data.results || []);
        }
        catch (error) {
            console.error('Search failed:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const clearFilters = () => {
        setFilters({
            make: '',
            model: '',
            year: '',
            hasAccidents: '',
            minYear: '',
            maxYear: '',
        });
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-2" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "AeroFresh" })] }), _jsxs("nav", { className: "flex space-x-8", children: [_jsx(LinkComponent, { href: "/", className: "text-gray-600 hover:text-gray-900", children: "Dashboard" }), _jsx(LinkComponent, { href: "/search", className: "text-blue-600 font-medium", children: "Search" }), _jsx(LinkComponent, { href: "/live-tracking", className: "text-gray-600 hover:text-gray-900", children: "Live Tracking" }), _jsx(LinkComponent, { href: "/reports", className: "text-gray-600 hover:text-gray-900", children: "Reports" })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Aircraft Search" }), _jsx("p", { className: "text-gray-600", children: "Find aircraft using advanced search filters" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 sticky top-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filters" }), _jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "lg:hidden flex items-center text-blue-600 hover:text-blue-700", children: [_jsx(FilterIcon, { className: "h-4 w-4 mr-1" }), showFilters ? 'Hide' : 'Show'] })] }), _jsxs("div", { className: `space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Aircraft Make" }), _jsx("input", { type: "text", value: filters.make, onChange: (e) => setFilters({ ...filters, make: e.target.value }), placeholder: "e.g., Cessna, Boeing", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Aircraft Model" }), _jsx("input", { type: "text", value: filters.model, onChange: (e) => setFilters({ ...filters, model: e.target.value }), placeholder: "e.g., 172, 737", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Year Range" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { type: "number", value: filters.minYear, onChange: (e) => setFilters({ ...filters, minYear: e.target.value }), placeholder: "Min", className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("input", { type: "number", value: filters.maxYear, onChange: (e) => setFilters({ ...filters, maxYear: e.target.value }), placeholder: "Max", className: "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Accident History" }), _jsxs("select", { value: filters.hasAccidents, onChange: (e) => setFilters({ ...filters, hasAccidents: e.target.value }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "Filter by accident history", children: [_jsx("option", { value: "", children: "All Aircraft" }), _jsx("option", { value: "false", children: "No Accidents" }), _jsx("option", { value: "true", children: "Has Accidents" })] })] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { onClick: handleSearch, disabled: loading, className: "flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50", children: loading ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Searching..."] })) : (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx(SearchIcon, { className: "h-4 w-4 mr-2" }), "Search"] })) }), _jsx("button", { onClick: clearFilters, className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500", "aria-label": "Clear filters", children: _jsx(XIcon, { className: "h-4 w-4" }) })] })] })] }) }), _jsx("div", { className: "lg:col-span-3", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Search Results (", results.length, ")"] }) }), results.length > 0 ? (_jsx("div", { className: "divide-y divide-gray-200", children: results.map((aircraft) => (_jsx(LinkComponent, { href: `/aircraft/${aircraft.tail}`, className: "block p-6 hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(PlaneIcon, { className: "h-8 w-8 text-blue-600 mr-4" }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-gray-900", children: aircraft.tail }), _jsxs("p", { className: "text-sm text-gray-600", children: [aircraft.make, " ", aircraft.model] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Year: ", aircraft.year || 'Unknown'] }), _jsx("div", { className: "mt-1", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: "View Details" }) })] })] }) }, aircraft.tail))) })) : (_jsxs("div", { className: "p-12 text-center", children: [_jsx(PlaneIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No Results Found" }), _jsx("p", { className: "text-gray-600", children: "Try adjusting your search filters or search terms." })] }))] }) })] })] })] }));
}
