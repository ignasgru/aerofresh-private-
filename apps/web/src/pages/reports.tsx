import React, { useState, useEffect } from 'react';
import { FileText, Download, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportData {
  totalAircraft: number;
  aircraftWithAccidents: number;
  averageAccidentsPerAircraft: number;
  accidentsByYear: Array<{ year: string; count: number }>;
  accidentsBySeverity: Array<{ severity: string; count: number; percentage: number }>;
  topAircraftTypes: Array<{ make: string; model: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<'overview' | 'safety' | 'fleet'>('overview');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration - in real app, this would come from API
      const mockData: ReportData = {
        totalAircraft: 284739,
        aircraftWithAccidents: 15432,
        averageAccidentsPerAircraft: 0.12,
        accidentsByYear: [
          { year: '2020', count: 1250 },
          { year: '2021', count: 1180 },
          { year: '2022', count: 1420 },
          { year: '2023', count: 1350 },
          { year: '2024', count: 980 },
        ],
        accidentsBySeverity: [
          { severity: 'Minor', count: 2450, percentage: 45.2 },
          { severity: 'Major', count: 1850, percentage: 34.1 },
          { severity: 'Fatal', count: 1120, percentage: 20.7 },
        ],
        topAircraftTypes: [
          { make: 'Cessna', model: '172', count: 12450 },
          { make: 'Piper', model: 'Cherokee', count: 8950 },
          { make: 'Beechcraft', model: 'Bonanza', count: 6750 },
          { make: 'Cessna', model: '182', count: 5430 },
          { make: 'Mooney', model: 'M20', count: 4320 },
        ],
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
    // In real app, this would generate and download the report
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Report</h1>
          <p className="text-gray-600">Unable to fetch report data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">AeroFresh</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="/search" className="text-gray-600 hover:text-gray-900">Search</a>
              <a href="/reports" className="text-blue-600 font-medium">Reports</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Aviation Safety Reports</h2>
              <p className="text-gray-600">Comprehensive analysis of aircraft safety and fleet data</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => exportReport('pdf')}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => exportReport('csv')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'safety', label: 'Safety Analysis', icon: AlertTriangle },
                { id: 'fleet', label: 'Fleet Statistics', icon: TrendingUp },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedReport(id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedReport === id
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
        </div>

        {/* Overview Report */}
        {selectedReport === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Aircraft</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.totalAircraft.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aircraft with Accidents</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.aircraftWithAccidents.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Accidents/Aircraft</p>
                    <p className="text-2xl font-bold text-gray-900">{reportData.averageAccidentsPerAircraft}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Safety Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {((1 - reportData.aircraftWithAccidents / reportData.totalAircraft) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accidents by Year Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Accidents by Year</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.accidentsByYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Safety Analysis Report */}
        {selectedReport === 'safety' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Accidents by Severity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Accidents by Severity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.accidentsBySeverity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ severity, percentage }) => `${severity}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.accidentsBySeverity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Safety Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Safety Recommendations</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-gray-900">High Priority</h4>
                    <p className="text-sm text-gray-600">Focus on {reportData.accidentsBySeverity[2].count} fatal accidents requiring immediate attention</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-gray-900">Medium Priority</h4>
                    <p className="text-sm text-gray-600">Address {reportData.accidentsBySeverity[1].count} major accidents through improved training</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">Low Priority</h4>
                    <p className="text-sm text-gray-600">Monitor {reportData.accidentsBySeverity[0].count} minor incidents for patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fleet Statistics Report */}
        {selectedReport === 'fleet' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Aircraft Types</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData.topAircraftTypes} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="model" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Distribution</h3>
                <div className="space-y-3">
                  {reportData.topAircraftTypes.map((aircraft, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {aircraft.make} {aircraft.model}
                      </span>
                      <span className="text-sm text-gray-600">
                        {aircraft.count.toLocaleString()} aircraft
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Most Popular Type</h4>
                    <p className="text-sm text-blue-700">
                      {reportData.topAircraftTypes[0].make} {reportData.topAircraftTypes[0].model} dominates the fleet
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Fleet Growth</h4>
                    <p className="text-sm text-green-700">
                      General aviation aircraft represent the majority of registered aircraft
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
