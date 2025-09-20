import React, { useState, useEffect } from 'react';
import { MapPin, Plane, RefreshCw, Filter, Clock } from 'lucide-react';
import Link from 'next/link';

// Type assertions for React 19 compatibility
const MapPinIcon = MapPin as React.ComponentType<any>;
const PlaneIcon = Plane as React.ComponentType<any>;
const RefreshCwIcon = RefreshCw as React.ComponentType<any>;
const FilterIcon = Filter as React.ComponentType<any>;
const ClockIcon = Clock as React.ComponentType<any>;
const LinkComponent = Link as React.ComponentType<any>;

interface AircraftPosition {
  id: number;
  tail: string;
  ts: string;
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  heading: number;
  src: string;
  aircraft?: {
    tail: string;
    make: string;
    model: string;
    year: number;
  };
}

interface LiveTrackingData {
  positions: AircraftPosition[];
  count: number;
  timeRange: string;
  lastUpdate: string;
}

export default function LiveTracking() {
  const [data, setData] = useState<LiveTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    limit: 50,
    minutes: 30,
    latMin: '',
    latMax: '',
    lonMin: '',
    lonMax: ''
  });
  const [viewMode, setViewMode] = useState<'all' | 'region'>('all');

  const fetchLiveData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = 'http://192.168.3.1:3001/api/tracking/live';
      const params = new URLSearchParams();
      
      if (viewMode === 'all') {
        params.append('limit', filters.limit.toString());
        params.append('minutes', filters.minutes.toString());
      } else {
        url = 'http://192.168.3.1:3001/api/tracking/region';
        params.append('limit', filters.limit.toString());
        if (filters.latMin) params.append('latMin', filters.latMin);
        if (filters.latMax) params.append('latMax', filters.latMax);
        if (filters.lonMin) params.append('lonMin', filters.lonMin);
        if (filters.lonMax) params.append('lonMax', filters.lonMax);
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
    } catch (error) {
      console.error('Failed to fetch live data:', error);
      setError(`Failed to fetch live data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const formatAltitude = (alt: number) => {
    return `${Math.round(alt * 3.28084)} ft`; // Convert meters to feet
  };

  const formatSpeed = (speed: number) => {
    return `${Math.round(speed * 1.94384)} kts`; // Convert m/s to knots
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getCardinalDirection = (heading: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <LinkComponent href="/" className="flex items-center">
                <PlaneIcon className="h-8 w-8 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">AeroFresh</h1>
              </LinkComponent>
            </div>
            <nav className="hidden md:flex space-x-8">
              <LinkComponent href="/" className="text-gray-600 hover:text-gray-900">Dashboard</LinkComponent>
              <LinkComponent href="/search" className="text-gray-600 hover:text-gray-900">Search</LinkComponent>
              <LinkComponent href="/live-tracking" className="text-blue-600 font-semibold">Live Tracking</LinkComponent>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Aircraft Tracking</h2>
          <p className="text-gray-600">
            Real-time aircraft positions from ADS-B data sources
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">View Mode:</span>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'all' | 'region')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                aria-label="Select view mode"
              >
                <option value="all">All Aircraft</option>
                <option value="region">Regional View</option>
              </select>
            </div>

            {viewMode === 'all' && (
              <>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Time Range:</span>
                  <select
                    value={filters.minutes}
                    onChange={(e) => setFilters({ ...filters, minutes: parseInt(e.target.value) })}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    aria-label="Select time range"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
              </>
            )}

            {viewMode === 'region' && (
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Region:</span>
                <input
                  type="number"
                  placeholder="Lat Min"
                  value={filters.latMin}
                  onChange={(e) => setFilters({ ...filters, latMin: e.target.value })}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                />
                <input
                  type="number"
                  placeholder="Lat Max"
                  value={filters.latMax}
                  onChange={(e) => setFilters({ ...filters, latMax: e.target.value })}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                />
                <input
                  type="number"
                  placeholder="Lon Min"
                  value={filters.lonMin}
                  onChange={(e) => setFilters({ ...filters, lonMin: e.target.value })}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                />
                <input
                  type="number"
                  placeholder="Lon Max"
                  value={filters.lonMax}
                  onChange={(e) => setFilters({ ...filters, lonMax: e.target.value })}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Limit:</span>
              <select
                value={filters.limit}
                onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                aria-label="Select number of results to display"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <button
              onClick={fetchLiveData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>

          {data && (
            <div className="text-sm text-gray-600">
              Showing {data.count} aircraft • Last updated: {formatTime(data.lastUpdate)} • 
              Time range: {data.timeRange}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading live aircraft data...</p>
          </div>
        )}

        {/* Aircraft List */}
        {data && data.positions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.positions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <PlaneIcon className="h-6 w-6 text-blue-600 mr-2" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{position.tail}</h3>
                      {position.aircraft && (
                        <p className="text-sm text-gray-600">
                          {position.aircraft.make} {position.aircraft.model} ({position.aircraft.year})
                        </p>
                      )}
                    </div>
                  </div>
                  <LinkComponent
                    href={`/aircraft/${position.tail}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </LinkComponent>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Position:</span>
                    <span className="font-mono">
                      {position.lat.toFixed(4)}, {position.lon.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Altitude:</span>
                    <span>{formatAltitude(position.alt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Speed:</span>
                    <span>{formatSpeed(position.speed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Heading:</span>
                    <span>
                      {position.heading.toFixed(0)}° {getCardinalDirection(position.heading)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span>{formatTime(position.ts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source:</span>
                    <span className="capitalize">{position.src}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Data Message */}
        {data && data.positions.length === 0 && (
          <div className="text-center py-12">
            <PlaneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Aircraft Found</h3>
            <p className="text-gray-600">
              No aircraft positions found for the selected criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
