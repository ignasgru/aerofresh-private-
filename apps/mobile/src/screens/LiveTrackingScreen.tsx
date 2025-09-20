import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api } from '../lib/network';

type LiveTrackingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LiveTracking'>;

interface Props {
  navigation: LiveTrackingScreenNavigationProp;
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
const LiveIcon = ({ size = 24, color = '#10B981' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📡</Text>
);
const PlaneIcon = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>✈️</Text>
);

export default function LiveTrackingScreen({ navigation }: Props) {
  const [livePositions, setLivePositions] = useState<LivePosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load live data on mount
  useEffect(() => {
    fetchLiveData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    setIsLoading(true);
    
    try {
      const { data, mode, isDemo } = await api.livePositions(20, 30);
      
      setLivePositions(data.positions || []);
      setLastUpdate(new Date());
      setIsDemoMode(isDemo);
      
      console.log(`📡 Live data fetched: ${isDemo ? 'Demo mode' : 'Live data'}, Status: ${mode}`);
    } catch (error) {
      console.error('Failed to fetch live data:', error);
      setLivePositions([]);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveData();
    setIsRefreshing(false);
  };

  const viewAircraftDetails = (tail: string) => {
    Alert.alert(
      'Aircraft Details',
      `Would you like to view detailed information for ${tail}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => {
          // Navigate to search with pre-filled tail number
          Alert.alert('Coming Soon', 'Detailed aircraft view coming soon!');
        }}
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <LiveIcon size={24} color="#10B981" />
        <Text style={styles.headerTitle}>Live Aircraft Tracking</Text>
      </View>
      <TouchableOpacity onPress={fetchLiveData} style={styles.refreshButton}>
        <Text style={styles.refreshText}>🔄</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatusInfo = () => (
    <View style={styles.statusContainer}>
      <Text style={styles.lastUpdateText}>
        Last update: {lastUpdate.toLocaleTimeString()}
      </Text>
      {isDemoMode && (
        <View style={styles.demoBadge}>
          <Text style={styles.demoText}>📡 Demo Data</Text>
        </View>
      )}
    </View>
  );

  const renderAircraftPosition = (position: LivePosition) => (
    <TouchableOpacity 
      key={position.id} 
      style={styles.positionCard}
      onPress={() => viewAircraftDetails(position.tail)}
    >
      <View style={styles.positionHeader}>
        <View style={styles.positionHeaderLeft}>
          <PlaneIcon size={20} color="#2563EB" />
          <Text style={styles.positionTail}>{position.tail}</Text>
        </View>
        <Text style={styles.positionTime}>
          {new Date(position.ts).toLocaleTimeString()}
        </Text>
      </View>
      
      <Text style={styles.positionAircraft}>
        {position.aircraft?.make} {position.aircraft?.model}
      </Text>
      
      <View style={styles.positionData}>
        <View style={styles.positionItem}>
          <Text style={styles.positionLabel}>Altitude</Text>
          <Text style={styles.positionValue}>{position.alt?.toFixed(0)} ft</Text>
        </View>
        <View style={styles.positionItem}>
          <Text style={styles.positionLabel}>Speed</Text>
          <Text style={styles.positionValue}>{position.speed?.toFixed(0)} kts</Text>
        </View>
        <View style={styles.positionItem}>
          <Text style={styles.positionLabel}>Heading</Text>
          <Text style={styles.positionValue}>{position.heading?.toFixed(0)}°</Text>
        </View>
      </View>
      
      <Text style={styles.positionCoords}>
        📍 {position.lat?.toFixed(4)}, {position.lon?.toFixed(4)}
      </Text>
    </TouchableOpacity>
  );

  const renderNoData = () => (
    <View style={styles.noDataContainer}>
      <LiveIcon size={48} color="#9CA3AF" />
      <Text style={styles.noDataText}>
        {isDemoMode ? 'Demo mode: Using simulated aircraft data' : 'No live aircraft positions available'}
      </Text>
      {isDemoMode ? (
        <Text style={styles.demoExplanation}>
          Network connection unavailable. Showing realistic demo data for testing.
        </Text>
      ) : null}
      <TouchableOpacity onPress={fetchLiveData} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && livePositions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading live aircraft data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderStatusInfo()}
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {livePositions.length > 0 ? (
          <View style={styles.positionsContainer}>
            {livePositions.map(renderAircraftPosition)}
          </View>
        ) : (
          renderNoData()
        )}
      </ScrollView>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  demoBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  demoText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  positionsContainer: {
    padding: 16,
    gap: 12,
  },
  positionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  positionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionTail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  positionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  positionAircraft: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  positionData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  positionItem: {
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  positionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  positionCoords: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoExplanation: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
