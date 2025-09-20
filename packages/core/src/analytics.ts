// Advanced Analytics Engine
// Provides insights, predictions, and trend analysis

export interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface FleetAnalytics {
  totalAircraft: number;
  averageRiskScore: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  accidentTrend: {
    last30Days: number;
    last90Days: number;
    lastYear: number;
  };
  topRiskFactors: Array<{
    factor: string;
    count: number;
    percentage: number;
  }>;
  recommendations: string[];
}

export interface RiskPrediction {
  aircraftTail: string;
  currentRiskScore: number;
  predictedRiskScore: number;
  riskFactors: Array<{
    factor: string;
    impact: number; // 0-100
    description: string;
  }>;
  recommendations: string[];
  confidence: number;
}

export class AnalyticsEngine {
  // Generate fleet-wide insights
  async generateInsights(): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];

    // Analyze accident trends
    const accidentTrend = await this.analyzeAccidentTrends();
    if (accidentTrend) {
      insights.push(accidentTrend);
    }

    // Analyze AD directive patterns
    const adPattern = await this.analyzeADPatterns();
    if (adPattern) {
      insights.push(adPattern);
    }

    // Analyze ownership patterns
    const ownershipPattern = await this.analyzeOwnershipPatterns();
    if (ownershipPattern) {
      insights.push(ownershipPattern);
    }

    // Analyze risk factors
    const riskFactors = await this.analyzeRiskFactors();
    insights.push(...riskFactors);

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  // Generate fleet analytics
  async generateFleetAnalytics(): Promise<FleetAnalytics> {
    const totalAircraft = await this.getTotalAircraftCount();
    const averageRiskScore = await this.getAverageRiskScore();
    const riskDistribution = await this.getRiskDistribution();
    const accidentTrend = await this.getAccidentTrend();
    const topRiskFactors = await this.getTopRiskFactors();
    const recommendations = await this.generateFleetRecommendations();

    return {
      totalAircraft,
      averageRiskScore,
      riskDistribution,
      accidentTrend,
      topRiskFactors,
      recommendations
    };
  }

  // Predict aircraft risk
  async predictAircraftRisk(aircraftTail: string): Promise<RiskPrediction> {
    const currentRiskScore = await this.getCurrentRiskScore(aircraftTail);
    const riskFactors = await this.analyzeAircraftRiskFactors(aircraftTail);
    const predictedRiskScore = await this.calculatePredictedRisk(riskFactors);
    const recommendations = await this.generateRiskRecommendations(aircraftTail, riskFactors);

    return {
      aircraftTail,
      currentRiskScore,
      predictedRiskScore,
      riskFactors,
      recommendations,
      confidence: this.calculatePredictionConfidence(riskFactors)
    };
  }

  // Analyze accident trends
  private async analyzeAccidentTrends(): Promise<AnalyticsInsight | null> {
    try {
      // Mock data analysis - in production, query actual database
      const recentAccidents = 15; // Last 30 days
      const previousAccidents = 8; // Previous 30 days
      
      if (recentAccidents > previousAccidents * 1.5) {
        return {
          type: 'trend',
          title: 'Rising Accident Trend',
          description: `Accidents have increased by ${Math.round(((recentAccidents - previousAccidents) / previousAccidents) * 100)}% in the last 30 days`,
          confidence: 85,
          severity: 'high',
          metadata: {
            recentCount: recentAccidents,
            previousCount: previousAccidents,
            trendDirection: 'up'
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Error analyzing accident trends:', error);
      return null;
    }
  }

  // Analyze AD directive patterns
  private async analyzeADPatterns(): Promise<AnalyticsInsight | null> {
    try {
      // Mock analysis - check for patterns in AD directives
      const highSeverityADs = 12; // Last 90 days
      
      if (highSeverityADs > 10) {
        return {
          type: 'anomaly',
          title: 'High Severity AD Surge',
          description: `${highSeverityADs} high-severity airworthiness directives issued in the last 90 days`,
          confidence: 90,
          severity: 'high',
          metadata: {
            adCount: highSeverityADs,
            timePeriod: '90 days'
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Error analyzing AD patterns:', error);
      return null;
    }
  }

  // Analyze ownership patterns
  private async analyzeOwnershipPatterns(): Promise<AnalyticsInsight | null> {
    try {
      // Mock analysis - check for ownership patterns
      const highOwnerTurnover = 25; // Aircraft with >5 owners
      const totalAircraft = 1000;
      const percentage = (highOwnerTurnover / totalAircraft) * 100;

      if (percentage > 20) {
        return {
          type: 'trend',
          title: 'High Ownership Turnover',
          description: `${percentage.toFixed(1)}% of aircraft have had 5+ owners, indicating potential maintenance or reliability issues`,
          confidence: 75,
          severity: 'medium',
          metadata: {
            affectedAircraft: highOwnerTurnover,
            totalAircraft,
            percentage
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Error analyzing ownership patterns:', error);
      return null;
    }
  }

  // Analyze risk factors
  private async analyzeRiskFactors(): Promise<AnalyticsInsight[]> {
    const insights: AnalyticsInsight[] = [];

    // Age-related risk
    insights.push({
      type: 'recommendation',
      title: 'Aircraft Age Risk',
      description: 'Aircraft over 30 years old show 40% higher accident rates',
      confidence: 80,
      severity: 'medium',
      metadata: {
        factor: 'age',
        impact: 40
      }
    });

    // Maintenance-related risk
    insights.push({
      type: 'recommendation',
      title: 'Maintenance Intervals',
      description: 'Aircraft with extended maintenance intervals show higher risk scores',
      confidence: 85,
      severity: 'high',
      metadata: {
        factor: 'maintenance',
        impact: 60
      }
    });

    return insights;
  }

  // Helper methods for fleet analytics
  private async getTotalAircraftCount(): Promise<number> {
    // Mock data - in production, query database
    return 284739;
  }

  private async getAverageRiskScore(): Promise<number> {
    // Mock data - in production, calculate from database
    return 35.2;
  }

  private async getRiskDistribution(): Promise<{ low: number; medium: number; high: number }> {
    // Mock data - in production, calculate from database
    return {
      low: 65,
      medium: 25,
      high: 10
    };
  }

  private async getAccidentTrend(): Promise<{ last30Days: number; last90Days: number; lastYear: number }> {
    // Mock data - in production, query database
    return {
      last30Days: 15,
      last90Days: 42,
      lastYear: 156
    };
  }

  private async getTopRiskFactors(): Promise<Array<{ factor: string; count: number; percentage: number }>> {
    // Mock data - in production, analyze database
    return [
      { factor: 'Age > 30 years', count: 1250, percentage: 45.2 },
      { factor: 'Multiple Accidents', count: 890, percentage: 32.1 },
      { factor: 'Open ADs', count: 620, percentage: 22.4 }
    ];
  }

  private async generateFleetRecommendations(): Promise<string[]> {
    return [
      'Implement proactive maintenance scheduling for aircraft over 25 years old',
      'Increase inspection frequency for aircraft with previous accident history',
      'Establish AD directive monitoring system for real-time alerts',
      'Consider fleet-wide risk assessment program',
      'Implement predictive maintenance based on usage patterns'
    ];
  }

  // Helper methods for risk prediction
  private async getCurrentRiskScore(aircraftTail: string): Promise<number> {
    // Mock data - in production, query database
    return 45;
  }

  private async analyzeAircraftRiskFactors(aircraftTail: string): Promise<Array<{ factor: string; impact: number; description: string }>> {
    // Mock analysis - in production, analyze specific aircraft data
    return [
      {
        factor: 'Age',
        impact: 30,
        description: 'Aircraft is 28 years old'
      },
      {
        factor: 'Accident History',
        impact: 50,
        description: 'Previous accident in 2022'
      },
      {
        factor: 'Maintenance',
        impact: 20,
        description: 'Regular maintenance schedule followed'
      }
    ];
  }

  private async calculatePredictedRisk(riskFactors: Array<{ factor: string; impact: number; description: string }>): Promise<number> {
    const baseRisk = 25;
    const totalImpact = riskFactors.reduce((sum, factor) => sum + factor.impact, 0);
    return Math.min(100, baseRisk + (totalImpact * 0.3));
  }

  private async generateRiskRecommendations(aircraftTail: string, riskFactors: Array<{ factor: string; impact: number; description: string }>): Promise<string[]> {
    const recommendations: string[] = [];

    riskFactors.forEach(factor => {
      if (factor.factor === 'Age' && factor.impact > 25) {
        recommendations.push('Consider more frequent inspections due to aircraft age');
      }
      if (factor.factor === 'Accident History' && factor.impact > 40) {
        recommendations.push('Review accident reports and ensure all repairs were completed properly');
      }
      if (factor.factor === 'Maintenance' && factor.impact < 30) {
        recommendations.push('Maintain current maintenance schedule');
      }
    });

    return recommendations;
  }

  private calculatePredictionConfidence(riskFactors: Array<{ factor: string; impact: number; description: string }>): number {
    // Confidence based on number of risk factors and their clarity
    const baseConfidence = 70;
    const factorBonus = Math.min(20, riskFactors.length * 5);
    return Math.min(95, baseConfidence + factorBonus);
  }
}
