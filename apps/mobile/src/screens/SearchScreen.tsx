import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Text, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api } from '../lib/network';

// Simple icon components
const SearchIcon = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>🔍</Text>
);
const PlaneIcon = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>✈️</Text>
);

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const [tail, setTail] = useState('');
  const [loading, setLoading] = useState(false);

  const searchAircraft = async () => {
    if (!tail.trim()) {
      Alert.alert('Error', 'Please enter a tail number');
      return;
    }
    
    setLoading(true);
    try {
      const { data, isDemo } = await api.aircraftSummary(tail.toUpperCase());
      
      if (data) {
        navigation.navigate('TailSummary', { 
          summary: data, 
          tail: tail.toUpperCase() 
        });
        
        if (isDemo) {
          Alert.alert('Demo Mode', `Showing demo data for ${tail.toUpperCase()}\n\nUsing offline demo data due to network connectivity.`);
        }
      } else {
        Alert.alert('Not Found', 'Aircraft not found in our database');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch aircraft data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (tailNumber: string) => {
    setTail(tailNumber);
    searchAircraft();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Aircraft Search</Text>
        <Text style={styles.subtitle}>Enter a tail number to get detailed aircraft information</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <PlaneIcon size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder="Enter tail number (e.g., N123AB)"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            value={tail}
            onChangeText={setTail}
            onSubmitEditing={searchAircraft}
            returnKeyType="search"
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.searchButton, loading && styles.searchButtonDisabled]} 
          onPress={searchAircraft}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <SearchIcon size={20} color="white" />
              <Text style={styles.searchButtonText}>Search</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.quickSearchSection}>
        <Text style={styles.sectionTitle}>Quick Search Examples</Text>
        <View style={styles.quickSearchGrid}>
          {['N123AB', 'N456CD', 'N789EF', 'N101GH'].map((example) => (
            <TouchableOpacity
              key={example}
              style={styles.quickSearchButton}
              onPress={() => quickSearch(example)}
            >
              <Text style={styles.quickSearchText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>What you can find:</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Text style={{ fontSize: 20, color: '#10B981' }}>✅</Text>
            <Text style={styles.featureText}>Registration status and airworthiness</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={{ fontSize: 20, color: '#F59E0B' }}>⚠️</Text>
            <Text style={styles.featureText}>Accident and incident history</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={{ fontSize: 20, color: '#3B82F6' }}>👥</Text>
            <Text style={styles.featureText}>Ownership history</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={{ fontSize: 20, color: '#8B5CF6' }}>📄</Text>
            <Text style={styles.featureText}>Airworthiness directives</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickSearchSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickSearchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickSearchButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickSearchText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
});
