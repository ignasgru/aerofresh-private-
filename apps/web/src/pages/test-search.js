import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export default function TestSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const testSearch = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            console.log('Testing search for:', searchTerm);
            const response = await fetch(`http://192.168.3.1:3001/api/search?q=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'x-api-key': 'demo-api-key',
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            if (!response.ok) {
                const errorText = await response.text();
                setError(`HTTP ${response.status}: ${errorText}`);
                return;
            }
            const data = await response.json();
            console.log('Response data:', data);
            setResult(data);
        }
        catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-100 p-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Search Test Page" }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md mb-6", children: [_jsxs("div", { className: "flex gap-4 mb-4", children: [_jsx("input", { type: "text", placeholder: "Enter tail number (e.g., N123AB)", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { onClick: testSearch, disabled: loading || !searchTerm.trim(), className: "px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50", children: loading ? 'Testing...' : 'Test Search' })] }), error && (_jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: [_jsx("strong", { children: "Error:" }), " ", error] })), result && (_jsxs("div", { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded", children: [_jsx("strong", { children: "Success!" }), " Found ", result.total, " aircraft", _jsx("pre", { className: "mt-2 text-sm overflow-auto", children: JSON.stringify(result, null, 2) })] }))] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Instructions" }), _jsxs("ol", { className: "list-decimal list-inside space-y-2 text-gray-700", children: [_jsx("li", { children: "Open browser developer tools (F12)" }), _jsx("li", { children: "Go to Console tab" }), _jsx("li", { children: "Enter \"N123AB\" in the search box" }), _jsx("li", { children: "Click \"Test Search\"" }), _jsx("li", { children: "Check console for any error messages" }), _jsx("li", { children: "Check Network tab to see the API request" })] })] })] }) }));
}
