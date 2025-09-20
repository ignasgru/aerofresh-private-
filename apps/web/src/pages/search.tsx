import React, { useState } from 'react';
import { Search, Filter, Plane, X } from 'lucide-react';
import Link from 'next/link';

// Type assertions for React 19 compatibility
const SearchIcon = Search as React.ComponentType<any>;
const FilterIcon = Filter as React.ComponentType<any>;
const PlaneIcon = Plane as React.ComponentType<any>;
const XIcon = X as React.ComponentType<any>;
const LinkComponent = Link as React.ComponentType<any>;

interface SearchFilters {
  make: string;
  model: string;
  year: string;
  hasAccidents: string;
  minYear: string;
  maxYear: string;
}

interface AircraftResult {
  tail: string;
  make: string;
  model: string;
  year: number;
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    make: '',
    model: '',
    year: '',
    hasAccidents: '',
    minYear: '',
    maxYear: '',
  });
  const [results, setResults] = useState<AircraftResult[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Use our working API server
      const searchQuery = filters.make || filters.model || '';
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('q', searchQuery);
      if (filters.make) params.append('make', filters.make);
      if (filters.model) params.append('model', filters.model);
      if (filters.year) params.append('year', filters.year);
      if (filters.hasAccidents) params.append('hasAccidents', filters.hasAccidents);
      
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
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PlaneIcon className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">AeroFresh</h1>
            </div>
            <nav className="flex space-x-8">
              <LinkComponent href="/" className="text-gray-600 hover:text-gray-900">Dashboard</LinkComponent>
              <LinkComponent href="/search" className="text-blue-600 font-medium">Search</LinkComponent>
              <LinkComponent href="/live-tracking" className="text-gray-600 hover:text-gray-900">Live Tracking</LinkComponent>
              <LinkComponent href="/reports" className="text-gray-600 hover:text-gray-900">Reports</LinkComponent>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Aircraft Search</h2>
          <p className="text-gray-600">Find aircraft using advanced search filters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center text-blue-600 hover:text-blue-700"
                >
                  <FilterIcon className="h-4 w-4 mr-1" />
                  {showFilters ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aircraft Make
                  </label>
                  <input
                    type="text"
                    value={filters.make}
                    onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                    placeholder="e.g., Cessna, Boeing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aircraft Model
                  </label>
                  <input
                    type="text"
                    value={filters.model}
                    onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                    placeholder="e.g., 172, 737"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={filters.minYear}
                      onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                      placeholder="Min"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.maxYear}
                      onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                      placeholder="Max"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accident History
                  </label>
                  <select
                    value={filters.hasAccidents}
                    onChange={(e) => setFilters({ ...filters, hasAccidents: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Filter by accident history"
                  >
                    <option value="">All Aircraft</option>
                    <option value="false">No Accidents</option>
                    <option value="true">Has Accidents</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Search
                      </div>
                    )}
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Clear filters"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results ({results.length})
                </h3>
              </div>

              {results.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {results.map((aircraft) => (
                    <LinkComponent
                      key={aircraft.tail}
                      href={`/aircraft/${aircraft.tail}`}
                      className="block p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PlaneIcon className="h-8 w-8 text-blue-600 mr-4" />
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {aircraft.tail}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {aircraft.make} {aircraft.model}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Year: {aircraft.year || 'Unknown'}
                          </p>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>
                    </LinkComponent>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
