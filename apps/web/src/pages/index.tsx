import React, { useState } from 'react';
import { Search, Plane, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

// Type assertions for React 19 compatibility
const SearchIcon = Search as React.ComponentType<any>;
const PlaneIcon = Plane as React.ComponentType<any>;
const AlertTriangleIcon = AlertTriangle as React.ComponentType<any>;
const MapPinIcon = MapPin as React.ComponentType<any>;
const CalendarIcon = Calendar as React.ComponentType<any>;
const LinkComponent = Link as React.ComponentType<any>;

interface AircraftSearchResult {
  tail: string;
  make: string;
  model: string;
  year: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<AircraftSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      } else {
        setError(`No aircraft found matching "${searchTerm}"`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PlaneIcon className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">AeroFresh</h1>
            </div>
                    <nav className="hidden md:flex space-x-8">
                      <LinkComponent href="/" className="text-gray-600 hover:text-gray-900">Dashboard</LinkComponent>
                      <LinkComponent href="/search" className="text-gray-600 hover:text-gray-900">Advanced Search</LinkComponent>
                      <LinkComponent href="/live-tracking" className="text-gray-600 hover:text-gray-900">Live Tracking</LinkComponent>
                      <LinkComponent href="/reports" className="text-gray-600 hover:text-gray-900">Reports</LinkComponent>
                    </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Aircraft Information Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get comprehensive aircraft history, safety records, and ownership information
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Enter tail number (e.g., N123AB) or aircraft make/model"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                aria-label="Search aircraft"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <SearchIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}
        {success && (
          <SuccessMessage message={success} onClose={() => setSuccess(null)} />
        )}

        {/* Search Results */}
        {(isLoading || searchResults.length > 0 || error) && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {isLoading ? 'Searching...' : 'Search Results'}
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for aircraft...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((aircraft) => (
                  <LinkComponent
                    key={aircraft.tail}
                    href={`/aircraft/${aircraft.tail}`}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      <PlaneIcon className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{aircraft.tail}</h4>
                        <p className="text-sm text-gray-600">{aircraft.make} {aircraft.model}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Year: {aircraft.year || 'Unknown'}</p>
                    </div>
                  </LinkComponent>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No aircraft found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <AlertTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety Records</h3>
            <p className="text-gray-600">
              Access comprehensive NTSB accident reports and safety incident history for any aircraft.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <MapPinIcon className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Tracking</h3>
            <p className="text-gray-600">
              Track aircraft in real-time with live position data and flight information.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <CalendarIcon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ownership History</h3>
            <p className="text-gray-600">
              View complete ownership history and registration details for any aircraft.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
