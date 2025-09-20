import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
// Simple icon components to avoid lucide-react-native dependency issues
const ArrowLeft = ({ size = 24, color = '#374151' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>←</Text>
);
const Plane = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>✈</Text>
);
const AlertTriangle = ({ size = 24, color = '#D97706' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>⚠</Text>
);
const Users = ({ size = 24, color = '#7C3AED' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>👥</Text>
);
const Shield = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>🛡</Text>
);
const DollarSign = ({ size = 24, color = '#059669' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>💰</Text>
);
const Wrench = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>🔧</Text>
);
const Calendar = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📅</Text>
);
const CheckCircle = ({ size = 24, color = '#059669' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>✅</Text>
);
const XCircle = ({ size = 24, color = '#DC2626' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>❌</Text>
);

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
}

interface MarketValue {
  current: number;
  range: { low: number; high: number };
  trend: 'up' | 'down' | 'stable';
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
}

const AircraftReportScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tail } = route.params as { tail: string };
  
  const [summary, setSummary] = useState<AircraftSummary | null>(null);
  const [history, setHistory] = useState<AircraftHistory | null>(null);
  const [loading, setLoading] = useState(true);
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
      ]
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
      }
    ]
  });

  useEffect(() => {
    fetchAircraftData();
  }, []);

  const fetchAircraftData = async () => {
    try {
      const headers = {
        'x-api-key': 'demo-api-key',
        'Content-Type': 'application/json',
      };

      // Use static data for mobile app
      const mockSummary: AircraftSummary = {
        tail: tail,
        regStatus: 'Valid',
        airworthiness: 'Airworthy',
        adOpenCount: 1,
        ntsbAccidents: 0,
        owners: 2,
        riskScore: 25,
        aircraft: {
          tail: tail,
          make: 'Cessna',
          model: '172',
          year: 2015,
          engine: 'Lycoming O-360',
          seats: 4
        }
      };

      const mockHistory: AircraftHistory = {
        owners: [
          {
            owner: {
              name: "John Smith Aviation LLC",
              type: "Corporation",
              state: "CA",
              country: "USA"
            },
            startDate: "2020-03-15",
            endDate: undefined
          }
        ],
        accidents: [],
        adDirectives: []
      };

      setSummary(mockSummary);
      setHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch aircraft data:', error);
      Alert.alert('Error', 'Failed to load aircraft data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return { color: '#059669', backgroundColor: '#D1FAE5' };
    if (score < 60) return { color: '#D97706', backgroundColor: '#FEF3C7' };
    return { color: '#DC2626', backgroundColor: '#FEE2E2' };
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
      case 'critical': return { color: '#DC2626', backgroundColor: '#FEE2E2' };
      case 'major': return { color: '#EA580C', backgroundColor: '#FED7AA' };
      case 'minor': return { color: '#D97706', backgroundColor: '#FEF3C7' };
      default: return { color: '#6B7280', backgroundColor: '#F3F4F6' };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading aircraft report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!summary) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Aircraft Not Found</Text>
          <Text style={styles.errorText}>The aircraft with tail number "{tail}" was not found.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Search</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📄' },
    { id: 'history', label: 'History', icon: '📅' },
    { id: 'inspections', label: 'Inspections', icon: '🔧' },
    { id: 'market', label: 'Market', icon: '💰' },
    { id: 'risk', label: 'Risk', icon: '🛡️' },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <CheckCircle size={24} color="#059669" />
          <Text style={styles.metricLabel}>Registration</Text>
          <Text style={styles.metricValue}>{summary.regStatus}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Shield size={24} color="#2563EB" />
          <Text style={styles.metricLabel}>Airworthiness</Text>
          <Text style={styles.metricValue}>{summary.airworthiness}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <AlertTriangle size={24} color="#D97706" />
          <Text style={styles.metricLabel}>Open ADs</Text>
          <Text style={styles.metricValue}>{summary.adOpenCount}</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Users size={24} color="#7C3AED" />
          <Text style={styles.metricLabel}>Owners</Text>
          <Text style={styles.metricValue}>{summary.owners}</Text>
        </View>
      </View>

      {/* Aircraft Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Aircraft Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tail Number</Text>
            <Text style={styles.detailValue}>{summary.aircraft.tail}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Make & Model</Text>
            <Text style={styles.detailValue}>{summary.aircraft.make} {summary.aircraft.model}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{summary.aircraft.year}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Engine</Text>
            <Text style={styles.detailValue}>{summary.aircraft.engine || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={styles.detailValue}>{summary.aircraft.seats || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      {history && (
        <>
          {/* Ownership History */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Ownership History</Text>
            {history.owners.map((owner, index) => (
              <View key={index} style={styles.ownerCard}>
                <Text style={styles.ownerName}>{owner.owner.name}</Text>
                <Text style={styles.ownerDetails}>
                  {owner.owner.type} • {owner.owner.state}, {owner.owner.country}
                </Text>
                <Text style={styles.ownerDate}>
                  From: {owner.startDate}
                  {owner.endDate && ` To: ${owner.endDate}`}
                </Text>
              </View>
            ))}
          </View>

          {/* Accident History */}
          {history.accidents.length > 0 && (
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Accident History</Text>
              {history.accidents.map((accident, index) => (
                <View key={index} style={styles.accidentCard}>
                  <View style={styles.accidentHeader}>
                    <Text style={styles.accidentDate}>{new Date(accident.date).toLocaleDateString()}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(accident.severity).backgroundColor }]}>
                      <Text style={[styles.severityText, { color: getSeverityColor(accident.severity).color }]}>
                        {accident.severity}
                      </Text>
                    </View>
                  </View>
                  {accident.narrative && (
                    <Text style={styles.accidentNarrative}>{accident.narrative}</Text>
                  )}
                  {(accident.injuries || accident.fatalities) && (
                    <Text style={styles.accidentStats}>
                      {accident.injuries && `Injuries: ${accident.injuries} `}
                      {accident.fatalities && `Fatalities: ${accident.fatalities}`}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );

  const renderInspections = () => (
    <View style={styles.tabContent}>
      {inspectionReports.map((report) => (
        <View key={report.id} style={styles.detailsCard}>
          <View style={styles.reportHeader}>
            <Text style={styles.cardTitle}>{report.id}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: report.status === 'Passed' ? '#D1FAE5' : '#FEE2E2' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: report.status === 'Passed' ? '#059669' : '#DC2626' }
              ]}>
                {report.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.reportDetails}>
            <Text style={styles.reportDetail}>Date: {report.date}</Text>
            <Text style={styles.reportDetail}>Inspector: {report.inspector}</Text>
            <Text style={styles.reportDetail}>Type: {report.type}</Text>
            <Text style={styles.reportDetail}>Hours: {report.hours.toLocaleString()}</Text>
          </View>
          
          {report.issues.length > 0 && (
            <View style={styles.issuesSection}>
              <Text style={styles.issuesTitle}>Issues Found</Text>
              {report.issues.map((issue, index) => (
                <View key={index} style={styles.issueRow}>
                  {issue.resolved ? (
                    <CheckCircle size={16} color="#059669" />
                  ) : (
                    <XCircle size={16} color="#DC2626" />
                  )}
                  <View style={[
                    styles.issueSeverity,
                    { backgroundColor: getSeverityColor(issue.severity).backgroundColor }
                  ]}>
                    <Text style={[
                      styles.issueSeverityText,
                      { color: getSeverityColor(issue.severity).color }
                    ]}>
                      {issue.severity}
                    </Text>
                  </View>
                  <Text style={styles.issueDescription}>{issue.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderMarket = () => (
    <View style={styles.tabContent}>
      {/* Current Market Value */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Market Value Analysis</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.currentValue}>{formatCurrency(marketValue.current)}</Text>
          <Text style={styles.valueRange}>
            Range: {formatCurrency(marketValue.range.low)} - {formatCurrency(marketValue.range.high)}
          </Text>
          <Text style={[
            styles.valueTrend,
            { color: marketValue.trend === 'up' ? '#059669' : '#DC2626' }
          ]}>
            {marketValue.trend === 'up' ? '📈 Increasing Value' : '📉 Decreasing Value'}
          </Text>
        </View>
      </View>

      {/* Value Factors */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Value Factors</Text>
        {marketValue.factors.map((factor, index) => (
          <View key={index} style={styles.factorRow}>
            <View style={[
              styles.factorDot,
              { backgroundColor: factor.impact === 'positive' ? '#059669' : '#DC2626' }
            ]} />
            <View style={styles.factorContent}>
              <Text style={styles.factorName}>{factor.factor}</Text>
              <Text style={styles.factorDescription}>{factor.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRisk = () => (
    <View style={styles.tabContent}>
      {/* Risk Score */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Risk Assessment</Text>
        <View style={styles.riskContainer}>
          <View style={[
            styles.riskScore,
            { backgroundColor: getRiskColor(summary.riskScore).backgroundColor }
          ]}>
            <Text style={[
              styles.riskScoreText,
              { color: getRiskColor(summary.riskScore).color }
            ]}>
              {summary.riskScore}/100
            </Text>
          </View>
          <Text style={styles.riskLevel}>{getRiskLevel(summary.riskScore)}</Text>
        </View>
      </View>

      {/* Risk Factors */}
      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Risk Factors</Text>
        <View style={styles.riskFactor}>
          <Text style={styles.riskFactorLabel}>Accident History</Text>
          <View style={styles.riskBar}>
            <View style={[styles.riskBarFill, { 
              width: `${summary.ntsbAccidents * 20}%`,
              backgroundColor: '#DC2626'
            }]} />
          </View>
          <Text style={styles.riskFactorValue}>{summary.ntsbAccidents}</Text>
        </View>
        
        <View style={styles.riskFactor}>
          <Text style={styles.riskFactorLabel}>Open ADs</Text>
          <View style={styles.riskBar}>
            <View style={[styles.riskBarFill, { 
              width: `${summary.adOpenCount * 25}%`,
              backgroundColor: '#D97706'
            }]} />
          </View>
          <Text style={styles.riskFactorValue}>{summary.adOpenCount}</Text>
        </View>
        
        <View style={styles.riskFactor}>
          <Text style={styles.riskFactorLabel}>Ownership Stability</Text>
          <View style={styles.riskBar}>
            <View style={[styles.riskBarFill, { 
              width: `${Math.max(0, 100 - summary.owners * 10)}%`,
              backgroundColor: '#059669'
            }]} />
          </View>
          <Text style={styles.riskFactorValue}>{summary.owners} owners</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Plane size={28} color="#2563EB" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{summary.aircraft.tail}</Text>
            <Text style={styles.headerSubtitle}>
              {summary.aircraft.make} {summary.aircraft.model} ({summary.aircraft.year})
            </Text>
          </View>
        </View>
        <View style={styles.riskBadge}>
          <Text style={[
            styles.riskBadgeText,
            { color: getRiskColor(summary.riskScore).color }
          ]}>
            {getRiskLevel(summary.riskScore)}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id as any)}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'inspections' && renderInspections()}
        {activeTab === 'market' && renderMarket()}
        {activeTab === 'risk' && renderRisk()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563EB',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginRight: '2%',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  ownerCard: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    marginBottom: 8,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  ownerDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  ownerDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  accidentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    paddingLeft: 12,
    marginBottom: 12,
  },
  accidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accidentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  accidentNarrative: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  accidentStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportDetails: {
    gap: 4,
    marginBottom: 16,
  },
  reportDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  issuesSection: {
    marginTop: 16,
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueSeverity: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
  },
  issueSeverityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  issueDescription: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  valueContainer: {
    alignItems: 'center',
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  valueRange: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  valueTrend: {
    fontSize: 14,
    fontWeight: '600',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  factorContent: {
    flex: 1,
  },
  factorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  factorDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  riskContainer: {
    alignItems: 'center',
  },
  riskScore: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  riskScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  riskLevel: {
    fontSize: 14,
    color: '#6B7280',
  },
  riskFactor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskFactorLabel: {
    fontSize: 14,
    color: '#111827',
    width: 120,
  },
  riskBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  riskFactorValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 40,
    textAlign: 'right',
  },
});

export default AircraftReportScreen;
