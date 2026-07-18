import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { globalStyles } from '../../styles/globalStyles';

import { getDatabase, onValue, ref } from "firebase/database";

export default function WeeklyReportScreen({ navigation }) {
  const { currentTheme } = useAppTheme();
  const { currentUser } = useUser();
  const styles = useMemo(() => globalStyles(currentTheme), [currentTheme]);

  const [dbMetrics, setDbMetrics] = useState({ weight: null, height: null, loading: true });

  useEffect(() => {
    if (currentUser?.uid) {
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);
      
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setDbMetrics({
            weight: data.weight || null,
            height: data.height || null,
            loading: false
          });
        } else {
          setDbMetrics(prev => ({ ...prev, loading: false }));
        }
      });

      return () => unsubscribe();
    } else {
      setDbMetrics(prev => ({ ...prev, loading: false }));
    }
  }, [currentUser]);

  const rawWeight = dbMetrics.weight || currentUser?.weight;
  const rawHeight = dbMetrics.height || currentUser?.height;

  const weight = rawWeight ? parseFloat(rawWeight) : null;
  const heightInFeet = rawHeight ? parseFloat(rawHeight) : null;

  const heightInMeters = heightInFeet ? (heightInFeet * 0.3048) : null;
  const bmi = (weight && heightInMeters) ? (weight / (heightInMeters * heightInMeters)) : null;

  const isMetricsMissing = !weight || !heightInFeet || isNaN(weight) || isNaN(heightInFeet);

  const reportMeta = useMemo(() => {
    if (!bmi) return null;
    if (bmi < 18.5) {
      return {
        type: 'FITNESS / CALISTHENICS DIAGNOSTIC',
        focus: 'Muscle Density & Core Stability Matrix',
        target: 'Targeting hyper-lean tracking parameters to safely balance biomechanical structural integrity.',
        metricName: 'Lean Mass Velocity Index',
        metricValue: '+2.4%'
      };
    } else if (bmi >= 18.5 && bmi < 25.0) {
      return {
        type: 'HYPERTROPHY PERFORMANCE MATRIX',
        focus: 'Mechanical Tension & Power Optimization',
        target: 'Tracking standard mass profile stability with continuous progressive overload algorithms.',
        metricName: 'Hypertrophy Torque Volume',
        metricValue: 'Optimal (1.0x)'
      };
    } else {
      return {
        type: 'CARDIOVASCULAR METABOLIC LOG',
        focus: 'Caloric Burn & Lipolysis Efficiency',
        target: 'Optimizing aerobic stamina thresholds to accelerate metabolic capacity and fat oxidation.',
        metricName: 'Active Metabolic Rate (AMR)',
        metricValue: 'High Output'
      };
    }
  }, [bmi]);

  if (dbMetrics.loading) {
    return (
      <View style={[styles.lockScreenWrapperDynamic, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: currentTheme.textLight || '#FFF' }}>Processing Analytics Stream...</Text>
      </View>
    );
  }

  if (isMetricsMissing) {
    return (
      <View style={styles.lockScreenWrapperDynamic}>
        <View style={[styles.widget, styles.lockWidgetCard]}>
          <Text style={styles.lockWidgetIcon}>📊</Text>
          <Text style={styles.lockWidgetTitle}>
            ANALYTICS ENGINE LOCKED
          </Text>
          <Text style={[styles.mutedText, styles.lockWidgetDesc, styles.textGrayDynamic]}>
            Your weekly performance dataset and progress graphics matrix will unlock once you configure your Height and Weight tracking parameters in the profile drawer.
          </Text>
          
          <TouchableOpacity 
            style={styles.lockReturnBtn} 
            onPress={() => navigation.navigate('MainDashboard')}
          >
            <Text style={styles.lockReturnBtnText}>← RETURN TO DASHBOARD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollContainerDynamic} 
      contentContainerStyle={styles.scrollContentPadding}
    >
      <View style={[styles.topRowSpacing, { justifyContent: 'flex-start', marginBottom: 28 }]}>
        <TouchableOpacity 
          style={styles.backToHomeBtnDynamic} 
          onBack={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.backToHomeBtnText}>← Back to Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextGroup}>
        <Text style={[styles.title, styles.headerMainTitle, styles.textLightDynamic]}>
          Performance Analytics
        </Text>
        <Text style={[styles.mutedText, styles.headerSubDesc, styles.textGrayDynamic]}>
          Realtime diagnostic reports generated from your body mass computations.
        </Text>
      </View>

      <View style={styles.telemetryActiveWidgetDynamic}>
        <Text style={styles.telemetryTitle}>{reportMeta?.type}</Text>
        <Text style={[styles.bodyText, styles.telemetryWeightRow, styles.textLightDynamic]}>
          Target Objective: <Text style={styles.boldWeightText}>{reportMeta?.focus}</Text>
        </Text>
        <Text style={[styles.mutedText, styles.telemetryHeightRow, styles.textGrayDynamic, { marginTop: 8, fontSize: 14, lineHeight: 22 }]}>
          {reportMeta?.target}
        </Text>
        
        <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderColor: 'rgba(0, 168, 255, 0.15)' }}>
          <Text style={{ color: currentTheme.textLight, fontSize: 13 }}>
            Current Status: <Text style={{ color: '#00A8FF', fontWeight: '800' }}>ACTIVE CALIBRATION</Text>
          </Text>
          <Text style={styles.telemetryBmiRow}>
            {reportMeta?.metricName}: {reportMeta?.metricValue}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}