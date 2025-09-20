import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plane, AlertTriangle, Users, MapPin, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

// Type assertions for React 19 compatibility
const ArrowLeftIcon = ArrowLeft as React.ComponentType<any>;
const PlaneIcon = Plane as React.ComponentType<any>;
const AlertTriangleIcon = AlertTriangle as React.ComponentType<any>;
const UsersIcon = Users as React.ComponentType<any>;
const MapPinIcon = MapPin as React.ComponentType<any>;
const CalendarIcon = Calendar as React.ComponentType<any>;
const FileTextIcon = FileText as React.ComponentType<any>;
const LinkComponent = Link as React.ComponentType<any>;

interface AircraftSummary {
  tail: string;
  regStatus: string;
  airworthiness: string;
  adOpenCount: number;
  ntsbAccidents: number;
  owners: number;
  riskScore: number;
}

interface AircraftHistory {
  owners: Array<{
    owner: {
      name: string;
      type: string;
      state: string;
      country: string;
    };
    startDate: string;
    endDate?: string;
  }>;
  accidents: Array<{
    date: string;
    severity: string;
    lat?: number;
    lon?: number;
    narrative?: string;
    injuries?: number;
    fatalities?: number;
  }>;
  adDirectives: Array<{
    ref: string;
    summary: string;
    effectiveDate: string;
    status: string;
    severity: string;
  }>;
}

export default function AircraftDetail({ initialSummary, initialHistory, tail: propTail }: { 
  initialSummary?: AircraftSummary, 
  initialHistory?: AircraftHistory, 
  tail?: string 
}) {
  const router = useRouter();
  const { tail: tailParam } = router.query;
  const aircraftTail = Array.isArray(tailParam) ? tailParam[0] : tailParam || propTail;
  const [summary, setSummary] = useState<AircraftSummary | null>(initialSummary || null);
  const [history, setHistory] = useState<AircraftHistory | null>(initialHistory || null);
  const [activeTab, setActiveTab] = useState<'summary' | 'history' | 'live'>('summary');
  const [loading, setLoading] = useState(!initialSummary);

  useEffect(() => {
    console.log('useEffect triggered, router ready:', router.isReady, 'tail:', aircraftTail);
    // Extract tail from URL manually as fallback
    const urlTail = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null;
    const testTail = aircraftTail || urlTail || 'N123AB';
    console.log('Using tail:', testTail);
    if (testTail) {
      fetchAircraftData(testTail);
    } else {
      console.log('No tail parameter, setting loading to false');
      setLoading(false);
    }
  }, [router.isReady, aircraftTail]);

  const fetchAircraftData = async (aircraftTail: string) => {
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
      } else {
        console.error('Summary request failed:', summaryRes.status, summaryRes.statusText);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        console.log('History data:', historyData);
        setHistory(historyData.history);
      } else {
        console.error('History request failed:', historyRes.status, historyRes.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch aircraft data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading aircraft data...</p>
          <p className="mt-2 text-sm text-gray-500">Tail: {aircraftTail || 'undefined'}</p>
          <p className="mt-1 text-sm text-gray-500">Router ready: {router.isReady ? 'true' : 'false'}</p>
          <button 
            onClick={() => {
              console.log('Button clicked, forcing data load');
              fetchAircraftData('N123AB');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Force Load Data
          </button>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Aircraft Not Found</h1>
          <p className="text-gray-600 mb-8">The aircraft with tail number "{aircraftTail}" was not found in our database.</p>
          <LinkComponent href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Search
          </LinkComponent>
        </div>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 50) return 'text-red-600 bg-red-100';
    if (score >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <LinkComponent href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Search
            </LinkComponent>
            <div className="flex items-center">
              <PlaneIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{summary.tail}</h1>
                <p className="text-sm text-gray-600">Aircraft Report</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FileTextIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Registration</p>
                <p className="text-lg font-semibold text-gray-900">{summary.regStatus}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <AlertTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Accidents</p>
                <p className="text-lg font-semibold text-gray-900">{summary.ntsbAccidents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Owners</p>
                <p className="text-lg font-semibold text-gray-900">{summary.owners}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                <span className="text-xs font-bold">RS</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className={`text-lg font-semibold px-2 py-1 rounded-full ${getRiskColor(summary.riskScore)}`}>
                  {summary.riskScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <LinkComponent
            href={`/aircraft/${aircraftTail}/report`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FileTextIcon className="h-4 w-4" />
            <span>Comprehensive Report</span>
          </LinkComponent>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'summary', label: 'Summary', icon: FileText },
                { id: 'history', label: 'History', icon: Calendar },
                { id: 'live', label: 'Live Data', icon: MapPin },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aircraft Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Registration Status</p>
                      <p className="font-medium">{summary.regStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Airworthiness</p>
                      <p className="font-medium">{summary.airworthiness}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Open AD Directives</p>
                      <p className="font-medium">{summary.adOpenCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">NTSB Accidents</p>
                      <p className="font-medium">{summary.ntsbAccidents}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && history && (
              <div className="space-y-8">
                {/* Ownership History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership History</h3>
                  <div className="space-y-4">
                    {history.owners.map((owner, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{owner.owner.name}</p>
                            <p className="text-sm text-gray-600">
                              {owner.owner.type} • {owner.owner.state}, {owner.owner.country}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(owner.startDate).toLocaleDateString()}
                              {owner.endDate && ` - ${new Date(owner.endDate).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accident History */}
                {history.accidents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Accident History</h3>
                    <div className="space-y-4">
                      {history.accidents.map((accident, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {new Date(accident.date).toLocaleDateString()}
                            </h4>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              {accident.severity}
                            </span>
                          </div>
                          {accident.narrative && (
                            <p className="text-sm text-gray-700 mb-2">{accident.narrative}</p>
                          )}
                          <div className="flex space-x-4 text-xs text-gray-600">
                            {accident.fatalities && <span>Fatalities: {accident.fatalities}</span>}
                            {accident.injuries && <span>Injuries: {accident.injuries}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AD Directives */}
                {history.adDirectives.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Airworthiness Directives</h3>
                    <div className="space-y-4">
                      {history.adDirectives.map((ad, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{ad.ref}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              ad.status === 'OPEN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {ad.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{ad.summary}</p>
                          <p className="text-xs text-gray-600">
                            Effective: {new Date(ad.effectiveDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'live' && (
              <div className="text-center py-12">
                <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Live Tracking</h3>
                <p className="text-gray-600">
                  Live tracking data is not currently available for this aircraft.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tail } = context.params as { tail: string };
  
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
  } catch (error) {
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
