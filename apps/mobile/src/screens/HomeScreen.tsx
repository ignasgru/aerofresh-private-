import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api, NetworkState, getCurrentNetworkState } from '../lib/network';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Aircraft {
  tail: string;
  make: string;
  model: string;
  year: number;
  riskScore?: number;
}

interface LivePosition {
  id: number;
  tail: string;
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  heading: number;
  ts: string;
  aircraft?: {
    make: string;
    model: string;
  };
}

// Simple icon components
const PlaneIcon = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>✈️</Text>
);
const SearchIcon = ({ size = 24, color = '#6B7280' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>🔍</Text>
);
const LiveIcon = ({ size = 24, color = '#10B981' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📡</Text>
);
const ReportIcon = ({ size = 24, color = '#8B5CF6' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📊</Text>
);
const TrendingIcon = ({ size = 24, color = '#F59E0B' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📈</Text>
);

export default function HomeScreen({ navigation }: Props) {
  const [networkStatus, setNetworkStatus] = useState<NetworkState>('checking');
  const [recentSearches, setRecentSearches] = useState<Aircraft[]>([]);
  const [livePositions, setLivePositions] = useState<LivePosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial load and network status check
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Check network status
      const healthStatus = await api.health();
      setNetworkStatus(healthStatus);
      
      // Load live positions for dashboard
      const { data: liveData } = await api.livePositions(5, 30);
      setLivePositions(liveData.positions || []);
      
      // Load recent searches (demo data for now)
      setRecentSearches([
        { tail: 'N123AB', make: 'Cessna', model: '172', year: 2020, riskScore: 15 },
        { tail: 'N456CD', make: 'Piper', model: 'Cherokee', year: 2018, riskScore: 20 },
      ]);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const quickSearch = (tailNumber: string) => {
    navigation.navigate('Search');
    // Simulate search after navigation
    setTimeout(() => {
      Alert.alert('Quick Search', `Searching for ${tailNumber}...`);
    }, 100);
  };

  const renderNetworkStatus = () => (
    <View style={[styles.statusCard, 
      networkStatus === 'online' ? styles.statusOnline : 
      networkStatus === 'offline' ? styles.statusOffline : styles.statusChecking]}>
      <View style={styles.statusContent}>
        <Text style={styles.statusIcon}>
          {networkStatus === 'online' ? '🟢' : 
           networkStatus === 'offline' ? '🔴' : '🟡'}
        </Text>
        <View style={styles.statusText}>
          <Text style={styles.statusTitle}>
            {networkStatus === 'online' ? 'Online' :
             networkStatus === 'offline' ? 'Offline Mode' : 'Checking...'}
          </Text>
          <Text style={styles.statusSubtitle}>
            {networkStatus === 'online' ? 'Live data available' :
             networkStatus === 'offline' ? 'Using demo data' : 'Connecting to servers...'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Search')}
        >
          <SearchIcon size={32} color="#2563EB" />
          <Text style={styles.actionTitle}>Search Aircraft</Text>
          <Text style={styles.actionSubtitle}>Find aircraft by tail number</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('LiveTracking')}
        >
          <LiveIcon size={32} color="#10B981" />
          <Text style={styles.actionTitle}>Live Tracking</Text>
          <Text style={styles.actionSubtitle}>Real-time aircraft positions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Reports')}
        >
          <ReportIcon size={32} color="#8B5CF6" />
          <Text style={styles.actionTitle}>Generate Report</Text>
          <Text style={styles.actionSubtitle}>Comprehensive aircraft history</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => Alert.alert('Coming Soon', 'Market analysis feature coming soon!')}
        >
          <TrendingIcon size={32} color="#F59E0B" />
          <Text style={styles.actionTitle}>Market Analysis</Text>
          <Text style={styles.actionSubtitle}>Value trends & insights</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentSearches = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recentSearches.map((aircraft, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.aircraftCard}
            onPress={() => quickSearch(aircraft.tail)}
          >
            <View style={styles.aircraftHeader}>
              <PlaneIcon size={20} color="#2563EB" />
              <Text style={styles.aircraftTail}>{aircraft.tail}</Text>
            </View>
            <Text style={styles.aircraftInfo}>{aircraft.make} {aircraft.model}</Text>
            <Text style={styles.aircraftYear}>{aircraft.year}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderLivePositions = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Aircraft</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LiveTracking')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {livePositions.slice(0, 3).map((position) => (
        <TouchableOpacity 
          key={position.id} 
          style={styles.positionCard}
          onPress={() => navigation.navigate('LiveTracking')}
        >
          <View style={styles.positionHeader}>
            <Text style={styles.positionTail}>{position.tail}</Text>
            <Text style={styles.positionTime}>
              {new Date(position.ts).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={styles.positionAircraft}>
            {position.aircraft?.make} {position.aircraft?.model}
          </Text>
          <View style={styles.positionData}>
            <Text style={styles.positionItem}>Alt: {position.alt?.toFixed(0)} ft</Text>
            <Text style={styles.positionItem}>Speed: {position.speed?.toFixed(0)} kts</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading AeroFresh...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {renderNetworkStatus()}
      {renderQuickActions()}
      {renderRecentSearches()}
      {renderLivePositions()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  statusCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusOnline: {
    backgroundColor: '#D1FAE5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  statusOffline: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  statusChecking: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  aircraftCard: {
    backgroundColor: 'white',
    width: 140,
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aircraftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aircraftTail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
  },
  aircraftInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  aircraftYear: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  positionCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  positionTail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  positionTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  positionAircraft: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  positionData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionItem: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
