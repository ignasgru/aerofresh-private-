import React, { useState } from 'react';

export default function TestSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
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
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter tail number (e.g., N123AB)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testSearch}
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Search'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>Success!</strong> Found {result.total} aircraft
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Open browser developer tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Enter "N123AB" in the search box</li>
            <li>Click "Test Search"</li>
            <li>Check console for any error messages</li>
            <li>Check Network tab to see the API request</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
