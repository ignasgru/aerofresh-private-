import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type TailSummaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TailSummary'>;
type TailSummaryScreenRouteProp = RouteProp<RootStackParamList, 'TailSummary'>;

interface Props {
  route: TailSummaryScreenRouteProp;
  navigation: TailSummaryScreenNavigationProp;
}

export default function TailSummaryScreen({ route, navigation }: Props) {
  const { summary, tail } = route.params;

  const getRiskColor = (score: number) => {
    if (score >= 50) return { color: '#DC2626', bg: '#FEE2E2' };
    if (score >= 25) return { color: '#D97706', bg: '#FEF3C7' };
    return { color: '#059669', bg: '#D1FAE5' };
  };

  const riskInfo = getRiskColor(summary.riskScore);

  const viewHistory = () => {
    Alert.alert('Coming Soon', 'Detailed aircraft history view coming soon!');
  };

  const getRiskLabel = (score: number) => {
    if (score >= 50) return 'High Risk';
    if (score >= 25) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aircraftInfo}>
          <Text style={{ fontSize: 32, color: '#3B82F6' }}>✈️</Text>
          <View style={styles.aircraftDetails}>
            <Text style={styles.tailNumber}>{tail}</Text>
            <Text style={styles.aircraftType}>Aircraft Report</Text>
          </View>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: riskInfo.bg }]}>
          <Text style={[styles.riskScore, { color: riskInfo.color }]}>
            {getRiskLabel(summary.riskScore)}
          </Text>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={{ fontSize: 24, color: '#3B82F6' }}>📄</Text>
          <Text style={styles.metricValue}>{summary.regStatus}</Text>
          <Text style={styles.metricLabel}>Registration</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={{ fontSize: 24, color: '#10B981' }}>✅</Text>
          <Text style={styles.metricValue}>{summary.airworthiness}</Text>
          <Text style={styles.metricLabel}>Airworthiness</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={{ fontSize: 24, color: '#F59E0B' }}>⚠️</Text>
          <Text style={styles.metricValue}>{summary.adOpenCount}</Text>
          <Text style={styles.metricLabel}>Open ADs</Text>
        </View>
      </View>

      {/* Safety Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Information</Text>
        <View style={styles.safetyGrid}>
          <View style={styles.safetyCard}>
            <Text style={{ fontSize: 20, color: '#DC2626' }}>🚨</Text>
            <Text style={styles.safetyValue}>{summary.ntsbAccidents}</Text>
            <Text style={styles.safetyLabel}>Accidents</Text>
          </View>
          
          <View style={styles.safetyCard}>
            <Text style={{ fontSize: 20, color: '#3B82F6' }}>👥</Text>
            <Text style={styles.safetyValue}>{summary.owners}</Text>
            <Text style={styles.safetyLabel}>Owners</Text>
          </View>
          
          <View style={styles.safetyCard}>
            <Text style={{ fontSize: 20, color: riskInfo.color }}>📈</Text>
            <Text style={[styles.safetyValue, { color: riskInfo.color }]}>
              {summary.riskScore}
            </Text>
            <Text style={styles.safetyLabel}>Risk Score</Text>
          </View>
        </View>
      </View>

      {/* Risk Assessment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Assessment</Text>
        <View style={[styles.riskCard, { backgroundColor: riskInfo.bg }]}>
          <View style={styles.riskHeader}>
            <Text style={{ fontSize: 24, color: riskInfo.color }}>
              {summary.riskScore >= 50 ? "⚠️" : summary.riskScore >= 25 ? "ℹ️" : "✅"}
            </Text>
            <Text style={[styles.riskTitle, { color: riskInfo.color }]}>
              {getRiskLabel(summary.riskScore)}
            </Text>
          </View>
          <Text style={styles.riskDescription}>
            {summary.riskScore >= 50 
              ? "This aircraft has a high risk score due to multiple accidents or open ADs. Exercise caution."
              : summary.riskScore >= 25 
              ? "This aircraft has a moderate risk score. Review safety history before purchase or operation."
              : "This aircraft has a low risk score and appears to be in good condition."
            }
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={viewHistory}>
          <Text style={{ fontSize: 20, color: '#fff' }}>🕐</Text>
          <Text style={styles.primaryButtonText}>View Full History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={{ fontSize: 20, color: '#3B82F6' }}>📤</Text>
          <Text style={styles.secondaryButtonText}>Share Report</Text>
        </TouchableOpacity>
      </View>

      {/* Additional Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Report Generated:</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data Source:</Text>
            <Text style={styles.infoValue}>FAA, NTSB, AD Database</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>Real-time</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aircraftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aircraftDetails: {
    marginLeft: 12,
  },
  tailNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  aircraftType: {
    fontSize: 14,
    color: '#6B7280',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskScore: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  safetyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safetyCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  safetyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  safetyLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  riskCard: {
    padding: 20,
    borderRadius: 12,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  riskDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
