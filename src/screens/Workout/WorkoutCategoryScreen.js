import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { globalStyles } from '../../styles/globalStyles';

import { getDatabase, onValue, ref } from "firebase/database";

export default function WorkoutCategoryScreen({ navigation }) {
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

  useEffect(() => {
    if (!dbMetrics.loading && isMetricsMissing) {
      const lockTitle = "Access Denied 🔒";
      const lockMessage = "Please configure your Height and Weight on the Dashboard first to unlock Analytics & Workout plans!";
      
      if (Platform.OS === 'web') {
        alert(`${lockTitle}\n\n${lockMessage}`);
      } else {
        Alert.alert(lockTitle, lockMessage);
      }
    }
  }, [isMetricsMissing, dbMetrics.loading]);

  const bmiMeta = useMemo(() => {
    if (!bmi) return { title: '', subtitle: '', route: '' };
    if (bmi < 18.5) {
      return { 
        title: 'ATHLETIC FITNESS NODE', 
        subtitle: 'Low BMI detected (<18.5). Calisthenics, core stability & muscle density protocol assigned.',
        route: 'DailyTrackingFitness'
      };
    } else if (bmi >= 18.5 && bmi < 25.0) {
      return { 
        title: 'ELITE GYM HYPERTROPHY', 
        subtitle: 'Normal BMI detected (18.5 - 24.9). High mechanical tension & weight training layout assigned.',
        route: 'DailyTrackingGym'
      };
    } else {
      return { 
        title: 'CARDIOVASCULAR MATRIX', 
        subtitle: 'Elevated BMI detected (≥25.0). Caloric burn optimization & aerobic endurance protocol assigned.',
        route: 'DailyTrackingCardio'
      };
    }
  }, [bmi]);

  if (dbMetrics.loading) {
    return (
      <View style={[styles.lockScreenWrapperDynamic, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: currentTheme.textLight || '#FFF' }}>Synchronizing Health Matrix...</Text>
      </View>
    );
  }

  if (isMetricsMissing) {
    return (
      <View style={styles.lockScreenWrapperDynamic}>
        <View style={[styles.widget, styles.lockWidgetCard]}>
          <Text style={styles.lockWidgetIcon}>🔒</Text>
          <Text style={styles.lockWidgetTitle}>
            ANALYTICS ENGINE LOCKED
          </Text>
          <Text style={[styles.mutedText, styles.lockWidgetDesc, styles.textGrayDynamic]}>
            You have not registered any Height or Weight parameters yet. Mass Gain and Hypertrophy layout architecture cannot clear authentication bounds without a verified BMI calculation.
          </Text>
          
          <TouchableOpacity 
            style={styles.lockReturnBtn} 
            onPress={() => navigation.navigate('Dashboard')}
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
      <View style={styles.topRowSpacing}>
        <TouchableOpacity 
          style={styles.backToHomeBtnDynamic} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToHomeBtnText}>← Back to Home</Text>
        </TouchableOpacity>
        <Text style={styles.topRowTagTextDynamic}>
          {bmiMeta.title}
        </Text>
      </View>

      <View style={styles.headerTextGroup}>
        <Text style={[styles.title, styles.headerMainTitle, styles.textLightDynamic]}>
          Tailored Workout Architecture
        </Text>
        <Text style={[styles.mutedText, styles.headerSubDesc, styles.textGrayDynamic]}>
          {bmiMeta.subtitle}
        </Text>
      </View>

      <View style={styles.telemetryActiveWidgetDynamic}>
        <Text style={styles.telemetryTitle}>Your Active Metrics Telemetry</Text>
        <Text style={[styles.bodyText, styles.telemetryWeightRow, styles.textLightDynamic]}>
          Registered Weight: <Text style={styles.boldWeightText}>{weight} KG</Text>
        </Text>
        <Text style={styles.telemetryHeightRow}>
          Registered Height: <Text style={styles.boldWeightText}>{heightInFeet} Feet</Text>
        </Text>
        <Text style={styles.telemetryBmiRow}>
          Calculated BMI Value: {bmi ? bmi.toFixed(1) : 'N/A'}
        </Text>
      </View>

      <View style={styles.actionBtnContainer}>
        <TouchableOpacity 
          style={styles.calibratedMatrixBtn} 
          onPress={() => navigation.navigate(bmiMeta.route)} 
          activeOpacity={0.85}
        >
          <Text style={styles.calibratedMatrixBtnText}>
            Open Your Calibrated Logger Matrix 📝
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}