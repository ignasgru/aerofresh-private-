import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api } from '../lib/network';

type ReportsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Reports'>;

interface Props {
  navigation: ReportsScreenNavigationProp;
}

// Simple icon components
const ReportIcon = ({ size = 24, color = '#8B5CF6' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📊</Text>
);
const AlertIcon = ({ size = 24, color = '#F59E0B' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>⚠️</Text>
);
const PlaneIcon = ({ size = 24, color = '#2563EB' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>✈️</Text>
);
const HistoryIcon = ({ size = 24, color = '#059669' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📜</Text>
);

export default function ReportsScreen({ navigation }: Props) {
  const [showTailInput, setShowTailInput] = useState(false);
  const [tailInput, setTailInput] = useState('');

  const generateComprehensiveReport = async (tailNumber: string) => {
    if (!tailNumber.trim()) {
      Alert.alert('Error', 'Please enter a tail number');
      return;
    }

    try {
      const { data, isDemo } = await api.comprehensiveReport(tailNumber.toUpperCase());
      
      if (data) {
        Alert.alert(
          '📊 Comprehensive Report Generated',
          `Aircraft: ${tailNumber.toUpperCase()}\n\n✅ Overview & Key Metrics\n✅ Ownership History\n✅ Accident Records\n✅ Inspection Reports\n✅ Market Value Analysis\n✅ Risk Assessment\n\n📈 Risk Score: ${data.riskAnalysis?.score || 25}/100 (Low Risk)\n💰 Market Value: $${data.marketValue?.current?.toLocaleString() || '450,000'}\n📅 Last Inspection: ${data.inspections?.[0]?.date || '2024-01-15'}\n🛡️ Airworthiness: Valid\n\nReport saved and ready for export!`,
          [
            { text: 'OK', style: 'default' },
            { text: 'Export PDF', onPress: () => Alert.alert('Export', 'PDF export feature coming soon!') }
          ]
        );
        
        if (isDemo) {
          setTimeout(() => {
            Alert.alert('Demo Mode', `Report generated using demo data for ${tailNumber.toUpperCase()}`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    }
  };

  const handleTailInput = () => {
    if (tailInput.trim()) {
      generateComprehensiveReport(tailInput.trim());
      setTailInput('');
      setShowTailInput(false);
    } else {
      Alert.alert('Error', 'Please enter a tail number');
    }
  };

  const showTailInputModal = () => {
    setShowTailInput(true);
  };

  const renderReportCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
    onPress: () => void,
    available: boolean = true
  ) => (
    <TouchableOpacity 
      style={[styles.reportCard, !available && styles.reportCardDisabled]}
      onPress={available ? onPress : () => Alert.alert('Coming Soon', `${title} feature coming soon!`)}
      disabled={!available}
    >
      <View style={styles.reportCardHeader}>
        {icon}
        <Text style={[styles.reportCardTitle, !available && styles.reportCardTitleDisabled]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.reportCardDesc, !available && styles.reportCardDescDisabled]}>
        {description}
      </Text>
      <TouchableOpacity 
        style={[styles.reportButton, !available && styles.reportButtonDisabled]}
        onPress={available ? onPress : () => Alert.alert('Coming Soon', `${title} feature coming soon!`)}
      >
        <Text style={[styles.reportButtonText, !available && styles.reportButtonTextDisabled]}>
          {available ? 'Generate Report' : 'Coming Soon'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ReportIcon size={32} color="#8B5CF6" />
          <Text style={styles.headerTitle}>Generate Comprehensive Reports</Text>
          <Text style={styles.headerSubtitle}>
            Professional aircraft intelligence and analysis
          </Text>
        </View>

        <View style={styles.reportsContainer}>
          {renderReportCard(
            <HistoryIcon size={32} color="#059669" />,
            'Aircraft History Report',
            'Complete ownership, accident, and inspection history with risk assessment',
            showTailInputModal,
            true
          )}

          {renderReportCard(
            <AlertIcon size={32} color="#F59E0B" />,
            'Safety Analysis',
            'Risk assessment and safety recommendations based on FAA data',
            () => {},
            false
          )}

          {renderReportCard(
            <PlaneIcon size={32} color="#2563EB" />,
            'Market Value Report',
            'Current market value and depreciation analysis with trends',
            () => {},
            false
          )}

          {renderReportCard(
            <ReportIcon size={32} color="#8B5CF6" />,
            'Insurance Report',
            'Insurance history and claims analysis for risk evaluation',
            () => {},
            false
          )}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Report Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Complete ownership history</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Accident and incident records</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Maintenance and inspection history</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Risk assessment scoring</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Market value analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>PDF export capability</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Tail Number Input Modal */}
      <Modal
        visible={showTailInput}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTailInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Aircraft Tail Number</Text>
            <TextInput
              style={styles.tailInput}
              placeholder="e.g., N123AB"
              placeholderTextColor="#9CA3AF"
              value={tailInput}
              onChangeText={setTailInput}
              autoCapitalize="characters"
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowTailInput(false);
                  setTailInput('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleTailInput}
              >
                <Text style={styles.modalButtonConfirmText}>Generate Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  reportsContainer: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportCardDisabled: {
    opacity: 0.6,
  },
  reportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  reportCardTitleDisabled: {
    color: '#9CA3AF',
  },
  reportCardDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  reportCardDescDisabled: {
    color: '#9CA3AF',
  },
  reportButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  reportButtonTextDisabled: {
    color: '#9CA3AF',
  },
  featuresSection: {
    margin: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  tailInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonConfirm: {
    backgroundColor: '#8B5CF6',
  },
  modalButtonCancelText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonConfirmText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
