import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  route: any;
  navigation: any;
}

interface Owner {
  owner: {
    name: string;
    type: string;
    state: string;
    country: string;
  };
  startDate: string;
  endDate?: string;
}

interface Accident {
  date: string;
  severity: string;
  lat?: number;
  lon?: number;
  narrative?: string;
  injuries?: number;
  fatalities?: number;
}

interface ADDirective {
  ref: string;
  summary: string;
  effectiveDate: string;
  status: string;
  severity: string;
}

interface HistoryData {
  owners: Owner[];
  accidents: Accident[];
  adDirectives: ADDirective[];
}

export default function AircraftHistoryScreen({ route, navigation }: Props) {
  const { tail } = route.params;
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'owners' | 'accidents' | 'ads'>('owners');

  useEffect(() => {
    fetchHistoryData();
  }, [tail]);

  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/aircraft/${tail}/history`);
      if (!response.ok) {
        Alert.alert('Error', 'Failed to fetch aircraft history');
        return;
      }
      const data = await response.json();
      setHistoryData(data.history);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch aircraft history. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'fatal':
        return '#DC2626';
      case 'major':
        return '#D97706';
      case 'minor':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#DC2626';
      case 'closed':
        return '#059669';
      case 'applicable':
        return '#D97706';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading aircraft history...</Text>
      </View>
    );
  }

  if (!historyData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#DC2626" />
        <Text style={styles.errorTitle}>Unable to Load History</Text>
        <Text style={styles.errorText}>Failed to fetch aircraft history data.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchHistoryData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aircraftInfo}>
          <Ionicons name="airplane" size={24} color="#3B82F6" />
          <Text style={styles.tailNumber}>{tail}</Text>
        </View>
        <Text style={styles.headerSubtitle}>Aircraft History</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'owners' && styles.activeTab]}
          onPress={() => setActiveTab('owners')}
        >
          <Ionicons name="people" size={16} color={activeTab === 'owners' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'owners' && styles.activeTabText]}>
            Owners ({historyData.owners.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'accidents' && styles.activeTab]}
          onPress={() => setActiveTab('accidents')}
        >
          <Ionicons name="warning" size={16} color={activeTab === 'accidents' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'accidents' && styles.activeTabText]}>
            Accidents ({historyData.accidents.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'ads' && styles.activeTab]}
          onPress={() => setActiveTab('ads')}
        >
          <Ionicons name="document-text" size={16} color={activeTab === 'ads' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'ads' && styles.activeTabText]}>
            ADs ({historyData.adDirectives.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'owners' && (
          <View style={styles.tabContent}>
            {historyData.owners.length > 0 ? (
              historyData.owners.map((owner, index) => (
                <View key={index} style={styles.ownerCard}>
                  <View style={styles.ownerHeader}>
                    <Ionicons name="person" size={20} color="#3B82F6" />
                    <Text style={styles.ownerName}>{owner.owner.name}</Text>
                  </View>
                  <View style={styles.ownerDetails}>
                    <Text style={styles.ownerType}>{owner.owner.type}</Text>
                    <Text style={styles.ownerLocation}>
                      {owner.owner.state}, {owner.owner.country}
                    </Text>
                  </View>
                  <View style={styles.ownerPeriod}>
                    <Text style={styles.periodText}>
                      {new Date(owner.startDate).toLocaleDateString()}
                      {owner.endDate && ` - ${new Date(owner.endDate).toLocaleDateString()}`}
                    </Text>
                    {!owner.endDate && (
                      <Text style={styles.currentOwner}>Current Owner</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateText}>No ownership history available</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'accidents' && (
          <View style={styles.tabContent}>
            {historyData.accidents.length > 0 ? (
              historyData.accidents.map((accident, index) => (
                <View key={index} style={styles.accidentCard}>
                  <View style={styles.accidentHeader}>
                    <View style={styles.accidentDate}>
                      <Ionicons name="calendar" size={16} color="#6B7280" />
                      <Text style={styles.dateText}>
                        {new Date(accident.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(accident.severity) + '20' }]}>
                      <Text style={[styles.severityText, { color: getSeverityColor(accident.severity) }]}>
                        {accident.severity}
                      </Text>
                    </View>
                  </View>
                  {accident.narrative && (
                    <Text style={styles.accidentNarrative}>{accident.narrative}</Text>
                  )}
                  <View style={styles.accidentStats}>
                    {accident.fatalities && accident.fatalities > 0 && (
                      <View style={styles.statItem}>
                        <Ionicons name="close-circle" size={16} color="#DC2626" />
                        <Text style={styles.statText}>{accident.fatalities} fatalities</Text>
                      </View>
                    )}
                    {accident.injuries && accident.injuries > 0 && (
                      <View style={styles.statItem}>
                        <Ionicons name="medical" size={16} color="#F59E0B" />
                        <Text style={styles.statText}>{accident.injuries} injuries</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
                <Text style={styles.emptyStateText}>No accidents recorded</Text>
                <Text style={styles.emptyStateSubtext}>This aircraft has a clean safety record</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'ads' && (
          <View style={styles.tabContent}>
            {historyData.adDirectives.length > 0 ? (
              historyData.adDirectives.map((ad, index) => (
                <View key={index} style={styles.adCard}>
                  <View style={styles.adHeader}>
                    <Text style={styles.adRef}>{ad.ref}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ad.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(ad.status) }]}>
                        {ad.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.adSummary}>{ad.summary}</Text>
                  <View style={styles.adDetails}>
                    <Text style={styles.adDate}>
                      Effective: {new Date(ad.effectiveDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.adSeverity}>Severity: {ad.severity}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={48} color="#059669" />
                <Text style={styles.emptyStateText}>No AD directives</Text>
                <Text style={styles.emptyStateSubtext}>No airworthiness directives apply to this aircraft</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  aircraftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tailNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  ownerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  ownerDetails: {
    marginBottom: 8,
  },
  ownerType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  ownerLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  ownerPeriod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodText: {
    fontSize: 12,
    color: '#6B7280',
  },
  currentOwner: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  accidentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  accidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accidentDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
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
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  accidentStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adRef: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
  adSummary: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  adDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  adSeverity: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
