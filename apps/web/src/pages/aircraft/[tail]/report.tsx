import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plane, AlertTriangle, Users, MapPin, Calendar, FileText, Shield, TrendingUp, DollarSign, Wrench, Clock, CheckCircle, XCircle, Star } from 'lucide-react';
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
const ShieldIcon = Shield as React.ComponentType<any>;
const TrendingUpIcon = TrendingUp as React.ComponentType<any>;
const DollarSignIcon = DollarSign as React.ComponentType<any>;
const WrenchIcon = Wrench as React.ComponentType<any>;
const ClockIcon = Clock as React.ComponentType<any>;
const CheckCircleIcon = CheckCircle as React.ComponentType<any>;
const XCircleIcon = XCircle as React.ComponentType<any>;
const StarIcon = Star as React.ComponentType<any>;
const LinkComponent = Link as React.ComponentType<any>;

interface AircraftSummary {
  tail: string;
  regStatus: string;
  airworthiness: string;
  adOpenCount: number;
  ntsbAccidents: number;
  owners: number;
  riskScore: number;
  aircraft: {
    tail: string;
    make: string;
    model: string;
    year: number;
    engine?: string;
    seats?: number;
    serial?: string;
  };
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
    phase?: string;
  }>;
  adDirectives: Array<{
    ref: string;
    summary: string;
    effectiveDate: string;
    status: string;
    severity: string;
  }>;
}

interface InspectionReport {
  id: string;
  date: string;
  inspector: string;
  type: 'Annual' | '100-Hour' | 'Pre-Purchase' | 'AD Compliance';
  status: 'Passed' | 'Failed' | 'Pending';
  hours: number;
  issues: Array<{
    severity: 'Critical' | 'Major' | 'Minor';
    description: string;
    resolved: boolean;
  }>;
  notes: string;
}

interface MarketValue {
  current: number;
  range: {
    low: number;
    high: number;
  };
  trend: 'up' | 'down' | 'stable';
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  comparableSales: Array<{
    tail: string;
    year: number;
    price: number;
    date: string;
  }>;
}

export default function AircraftReport({ initialSummary, initialHistory, tail: propTail }: { 
  initialSummary?: AircraftSummary, 
  initialHistory?: AircraftHistory, 
  tail?: string 
}) {
  const router = useRouter();
  const { tail: tailParam } = router.query;
  const aircraftTail = Array.isArray(tailParam) ? tailParam[0] : tailParam || propTail;
  
  const [summary, setSummary] = useState<AircraftSummary | null>(initialSummary || null);
  const [history, setHistory] = useState<AircraftHistory | null>(initialHistory || null);
  const [loading, setLoading] = useState(!initialSummary);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'inspections' | 'market' | 'risk'>('overview');

  // Mock data for demonstration
  const [inspectionReports] = useState<InspectionReport[]>([
    {
      id: 'INSP-2024-001',
      date: '2024-01-15',
      inspector: 'John Smith, A&P',
      type: 'Annual',
      status: 'Passed',
      hours: 2847,
      issues: [
        {
          severity: 'Minor',
          description: 'Minor paint chipping on left wing tip',
          resolved: true
        }
      ],
      notes: 'Aircraft in excellent condition. All systems operational.'
    },
    {
      id: 'INSP-2023-002',
      date: '2023-01-10',
      inspector: 'Mike Johnson, IA',
      type: 'Annual',
      status: 'Passed',
      hours: 2698,
      issues: [],
      notes: 'Routine annual inspection completed successfully.'
    }
  ]);

  const [marketValue] = useState<MarketValue>({
    current: 185000,
    range: { low: 165000, high: 205000 },
    trend: 'up',
    factors: [
      {
        factor: 'Low Flight Hours',
        impact: 'positive',
        description: 'Below average flight hours for aircraft age'
      },
      {
        factor: 'Recent Annual',
        impact: 'positive',
        description: 'Fresh annual inspection with no major issues'
      },
      {
        factor: 'Accident History',
        impact: 'negative',
        description: 'One minor accident in 2019'
      }
    ],
    comparableSales: [
      {
        tail: 'N456CD',
        year: 2015,
        price: 192000,
        date: '2024-01-20'
      },
      {
        tail: 'N789EF',
        year: 2014,
        price: 178000,
        date: '2023-12-15'
      }
    ]
  });

  useEffect(() => {
    if (router.isReady && aircraftTail && !summary) {
      fetchAircraftData(aircraftTail);
    }
  }, [router.isReady, aircraftTail, summary]);

  const fetchAircraftData = async (currentAircraftTail: string) => {
    try {
      const headers = {
        'x-api-key': 'demo-api-key',
        'Content-Type': 'application/json',
      };

      const [summaryRes, historyRes] = await Promise.all([
        fetch(`http://192.168.3.1:3001/api/aircraft/${currentAircraftTail}/summary`, { headers }),
        fetch(`http://192.168.3.1:3001/api/aircraft/${currentAircraftTail}/history`, { headers })
      ]);

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary);
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData.history);
      }
    } catch (error) {
      console.error('Failed to fetch aircraft data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'major': return 'text-orange-600 bg-orange-100';
      case 'minor': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading aircraft report...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Aircraft Not Found</h1>
          <p className="text-gray-600 mb-8">The aircraft with tail number "{aircraftTail}" was not found.</p>
          <LinkComponent href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Search
          </LinkComponent>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileTextIcon },
    { id: 'history', label: 'History', icon: CalendarIcon },
    { id: 'inspections', label: 'Inspections', icon: WrenchIcon },
    { id: 'market', label: 'Market Value', icon: DollarSignIcon },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LinkComponent href="/" className="mr-4">
                <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </LinkComponent>
              <PlaneIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{summary.aircraft.tail}</h1>
                <p className="text-sm text-gray-600">{summary.aircraft.make} {summary.aircraft.model} ({summary.aircraft.year})</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(summary.riskScore)}`}>
                {getRiskLevel(summary.riskScore)}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Risk Score</div>
                <div className="text-xl font-bold text-gray-900">{summary.riskScore}/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Registration Status</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.regStatus}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShieldIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Airworthiness</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.airworthiness}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangleIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Open ADs</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.adOpenCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Owners</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.owners}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aircraft Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Aircraft Details</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Tail Number</div>
                    <div className="text-sm text-gray-900">{summary.aircraft.tail}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Make & Model</div>
                    <div className="text-sm text-gray-900">{summary.aircraft.make} {summary.aircraft.model}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Year</div>
                    <div className="text-sm text-gray-900">{summary.aircraft.year}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Engine</div>
                    <div className="text-sm text-gray-900">{summary.aircraft.engine || 'N/A'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Seats</div>
                    <div className="text-sm text-gray-900">{summary.aircraft.seats || 'N/A'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Serial Number</div>
                    <div className="text-sm text-gray-900">{summary.aircraft.serial || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && history && (
          <div className="space-y-6">
            {/* Ownership History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ownership History</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {history.owners.map((owner, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== history.owners.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <UsersIcon className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{owner.owner.name}</p>
                                <p className="text-sm text-gray-500">
                                  {owner.owner.type} • {owner.owner.state}, {owner.owner.country}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                <p>From: {owner.startDate}</p>
                                {owner.endDate && <p>To: {owner.endDate}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Accident History */}
            {history.accidents.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Accident History</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {history.accidents.map((accident, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {new Date(accident.date).toLocaleDateString()}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            accident.severity === 'FATAL' ? 'bg-red-100 text-red-800' :
                            accident.severity === 'SERIOUS' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {accident.severity}
                          </span>
                        </div>
                        {accident.narrative && (
                          <p className="mt-1 text-sm text-gray-600">{accident.narrative}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-500">
                          {accident.injuries && <span>Injuries: {accident.injuries} </span>}
                          {accident.fatalities && <span>Fatalities: {accident.fatalities} </span>}
                          {accident.phase && <span>Phase: {accident.phase}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="space-y-6">
            {inspectionReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{report.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Passed' ? 'bg-green-100 text-green-800' :
                      report.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">Date</div>
                      <div className="text-sm text-gray-900">{report.date}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">Inspector</div>
                      <div className="text-sm text-gray-900">{report.inspector}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">Type</div>
                      <div className="text-sm text-gray-900">{report.type}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">Hours</div>
                      <div className="text-sm text-gray-900">{report.hours.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  {report.issues.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Issues Found</h4>
                      <div className="space-y-2">
                        {report.issues.map((issue, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {issue.resolved ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                              {issue.severity}
                            </span>
                            <span className="text-sm text-gray-900">{issue.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {report.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-700">{report.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            {/* Current Market Value */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Market Value Analysis</h3>
              </div>
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrency(marketValue.current)}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUpIcon className={`h-5 w-5 ${marketValue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-medium ${marketValue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {marketValue.trend === 'up' ? 'Increasing' : 'Decreasing'} Value
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Range: {formatCurrency(marketValue.range.low)} - {formatCurrency(marketValue.range.high)}
                  </div>
                </div>
              </div>
            </div>

            {/* Value Factors */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Value Factors</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {marketValue.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        factor.impact === 'positive' ? 'bg-green-500' :
                        factor.impact === 'negative' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{factor.factor}</p>
                        <p className="text-sm text-gray-600">{factor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparable Sales */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Comparable Sales</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {marketValue.comparableSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sale.tail}</p>
                        <p className="text-sm text-gray-500">{sale.year} • {sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(sale.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            {/* Risk Score Breakdown */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
              </div>
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getRiskColor(summary.riskScore)}`}>
                    {summary.riskScore}/100
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{getRiskLevel(summary.riskScore)}</p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Risk Factors</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Accident History</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className={`bg-red-500 h-2 rounded-full ${summary.ntsbAccidents > 0 ? 'w-1/5' : 'w-0'}`}></div>
                        </div>
                      <span className="text-sm font-medium text-gray-900">{summary.ntsbAccidents}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Open ADs</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className={`bg-yellow-500 h-2 rounded-full ${summary.adOpenCount > 0 ? 'w-1/4' : 'w-0'}`}></div>
                        </div>
                      <span className="text-sm font-medium text-gray-900">{summary.adOpenCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Ownership Stability</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className={`bg-green-500 h-2 rounded-full ${summary.owners <= 3 ? 'w-3/4' : summary.owners <= 5 ? 'w-1/2' : 'w-1/4'}`}></div>
                        </div>
                      <span className="text-sm font-medium text-gray-900">{summary.owners} owners</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tail } = context.params!;
  const tailString = Array.isArray(tail) ? tail[0] : tail;

  try {
    const headers = {
      'x-api-key': 'demo-api-key',
      'Content-Type': 'application/json',
    };

    const [summaryRes, historyRes] = await Promise.all([
      fetch(`http://192.168.3.1:3001/api/aircraft/${tailString}/summary`, { headers }),
      fetch(`http://192.168.3.1:3001/api/aircraft/${tailString}/history`, { headers })
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
        initialSummary,
        initialHistory,
        tail: tailString,
      },
    };
  } catch (error) {
    console.error('Failed to fetch aircraft data:', error);
    return {
      props: {
        initialSummary: null,
        initialHistory: null,
        tail: tailString,
      },
    };
  }
};
