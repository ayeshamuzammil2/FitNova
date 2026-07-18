import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { globalStyles } from '../../styles/globalStyles';

import { getDatabase, onValue, ref, update } from "firebase/database";
import { showMessage } from "react-native-flash-message";

// 1. Safe Native Notification Core Import
import * as Notifications from 'expo-notifications';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log("Handler setup bypassed safely");
}

export default function DashboardScreen({ navigation }) {
  const { currentTheme } = useAppTheme();
  const { currentUser, setCurrentUser } = useUser();
  
  const [weight, setWeight] = useState('');
  const [heightInFeet, setHeightInFeet] = useState(''); 
  const [recommendation, setRecommendation] = useState(null);

  const [showTopToast, setShowTopToast] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // 2. Android Push Channel Configuration with Try-Catch Protection
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F71',
          });
        } catch (e) {
          console.log("Channel registration bypassed");
        }
      }
      
      if (Platform.OS !== 'web') {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            console.log('Push permissions denied');
          }
        } catch (err) {
          console.log("Permission thread safe guarded");
        }
      }
    })();
  }, []);

  // Welcome user animation banner
  useEffect(() => {
    if (currentUser?.uid) {
      setShowTopToast(true);
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -120,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setShowTopToast(false);
        });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentUser?.uid]);

  // Firebase node data synchronization
  useEffect(() => {
    if (currentUser?.uid) {
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);
      
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (setCurrentUser) {
            setCurrentUser(prev => ({ ...prev, ...data }));
          }
          if (data.weight) setWeight(data.weight);
          if (data.height) setHeightInFeet(data.height);
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser?.uid]);

  const styles = useMemo(() => globalStyles(currentTheme), [currentTheme]);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const processBiometrics = async () => {
    if (!weight.toString().trim() || !heightInFeet.toString().trim()) {
      showAlert("Parameters Locked 🔒", "Please enter valid Height and Weight values.");
      return;
    }

    const weightKg = parseFloat(weight);
    const feet = parseFloat(heightInFeet);

    if (isNaN(weightKg) || isNaN(feet) || feet <= 0 || weightKg <= 0) {
      showAlert("Invalid Input ⚠️", "Please enter realistic values.");
      return;
    }

    const heightInMeters = feet * 0.3048;
    const bmi = weightKg / (heightInMeters * heightInMeters);

    let planTag = '';
    let planId = '';
    let planTitle = '';
    let planDesc = '';

    if (bmi < 18.5) {
      planId = 'fitness';
      planTag = 'UNDERWEIGHT';
      planTitle = '🤸 Fitness & Core Stability Plan';
      planDesc = 'Low BMI detected (<18.5). Stability logs activated.';
    } else if (bmi >= 18.5 && bmi < 25.0) {
      planId = 'gym';
      planTag = 'NORMAL WEIGHT';
      planTitle = '💪 Elite Gym Hypertrophy Plan';
      planDesc = 'Optimal standard body index configuration!';
    } else {
      planId = 'cardio';
      planTag = 'OVERWEIGHT';
      planTitle = '🏃 Cardio & Aerobic Endurance Plan';
      planDesc = 'Elevated metabolic volume registered.';
    }

    if (setCurrentUser) {
      setCurrentUser(prev => ({
        ...prev,
        weight: weight.toString().trim(),
        height: heightInFeet.toString().trim(),
        bmiScore: bmi.toFixed(1),
        healthStatus: planTag
      }));
    }

    if (currentUser?.uid) {
      try {
        const db = getDatabase();
        await update(ref(db, `users/${currentUser.uid}`), {
          weight: weight.toString().trim(),
          height: heightInFeet.toString().trim(),
          bmiScore: bmi.toFixed(1),
          healthStatus: planTag,
          updatedAt: new Date().toISOString()
        });
        
        // Flash Message
        showMessage({
          message: "🏋️‍♂️ FitNova Analytics Updated!",
          description: `Status: ${planTag} (BMI: ${bmi.toFixed(1)}). Database record locked!`,
          type: "success",
          backgroundColor: "#0F172A",
          textColor: "#10B981",
          duration: 4000,
          icon: "auto",
        });

        // 3. ACTUAL NATIVE PUSH TRIGGER 
        if (Platform.OS !== 'web') {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '🏋️‍♂️ FitNova Active Telemetry',
                body: `Your health matrix configuration locked! Status: ${planTag} (BMI: ${bmi.toFixed(1)}).`,
                sound: true,
              },
              trigger: null,
            });
          } catch (err) {
            console.log("Notification execution blocked in current sandbox context:", err.message);
          }
        }

      } catch (err) {
        console.error("Firebase Sync Error: ", err.message);
      }
    }

    setRecommendation({ 
      id: planId, 
      title: planTitle, 
      tag: planTag, 
      desc: planDesc 
    });
  };

  const handleNavigationToGrid = () => {
    const activeWeight = weight.toString().trim() || currentUser?.weight;
    const activeHeight = heightInFeet.toString().trim() || currentUser?.height;
    const targetPlanId = recommendation?.id || (currentUser?.healthStatus === 'OVERWEIGHT' ? 'cardio' : currentUser?.healthStatus === 'UNDERWEIGHT' ? 'fitness' : 'gym');

    if (!activeWeight || !activeHeight || !targetPlanId) {
      showAlert("Access Denied 🔒", "Complete your Biometric Form validation first!");
      return;
    }
    
    navigation.navigate('WorkoutCategory', { categoryId: targetPlanId });
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {showTopToast && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: '5%',
            right: '5%',
            backgroundColor: '#1E293B',
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#00A8FF',
            transform: [{ translateY: slideAnim }],
            zIndex: 9999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#00A8FF', fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
            FitNova Athlete Portal Active ⚡
          </Text>
          <Text style={{ color: '#F8FAFC', fontSize: 14, lineHeight: 20 }}>
            Welcome back! Your secure dynamic training log is initialized. Don't forget to calibrate your biometrics today!
          </Text>
        </Animated.View>
      )}

      <ScrollView style={styles.scrollContainerDynamic} contentContainerStyle={styles.scrollContentPadding}>
        <View style={[styles.topRow, styles.topRowRight]}>
          <TouchableOpacity style={styles.accountBtn} onPress={() => navigation.openDrawer()}>
            <Text style={[styles.backToHomeBtnText, styles.boldWeightText]}>
              My Profile / Menu 👤 ☰
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={[styles.title, styles.headerMainTitle, styles.textLightDynamic]}>
            Welcome back, {currentUser?.username || currentUser?.email || 'Athlete'}
          </Text>
          <Text style={[styles.mutedText, styles.headerSubDesc, styles.textGrayDynamic]}>
            Biometric Telemetry & Account Control Workspace
          </Text>
        </View>

        <View style={styles.widget}>
          <Text style={[styles.widgetTitle, styles.widgetTitleSpacing]}>
            Biometric Calibration Form
          </Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Body Weight (kg)" 
            placeholderTextColor={currentTheme.textGray} 
            keyboardType="numeric" 
            value={weight.toString()} 
            onChangeText={setWeight} 
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Vertical Height (e.g. 5.4 feet)" 
            placeholderTextColor={currentTheme.textGray} 
            keyboardType="numeric" 
            value={heightInFeet.toString()} 
            onChangeText={setHeightInFeet} 
          />

          <TouchableOpacity style={styles.btn} onPress={processBiometrics}>
            <Text style={styles.btnText}>Analyze Health Matrix</Text>
          </TouchableOpacity>
        </View>

        {(!recommendation && !currentUser?.healthStatus) ? (
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={[styles.widget, styles.lockWidgetCard, { borderStyle: 'solid', padding: 22, alignItems: 'flex-start' }]}
            onPress={handleNavigationToGrid}
          >
            <Text style={[styles.widgetTitle, styles.modalErrorTitle, styles.widgetTitleSpacing]}>
              🔒 ANALYTICS ENGINE LOCKED
            </Text>
            <Text style={[styles.mutedText, styles.headerSubDesc, styles.textGrayDynamic]}>
              Please perform biometrics calibration entry inputs.
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.telemetryActiveWidgetDynamic}>
            <Text style={styles.tagText}>🔓 {recommendation?.tag || currentUser?.healthStatus} ROUTE CONFIGURATION ACTIVE</Text>
            <Text style={[styles.title, styles.telemetryWeightRow, styles.textLightDynamic, { marginTop: 12, fontSize: 20 }]}>
              {recommendation?.title || '🏃 Plan Matrix Active'}
            </Text>
            <Text style={[styles.bodyText, styles.telemetryHeightRow, styles.textGrayDynamic, { marginTop: 6 }]}>
              {recommendation?.desc || 'Your personalized dynamic training log is ready.'}
            </Text>
            <TouchableOpacity style={styles.rightAlignBtn} onPress={handleNavigationToGrid}>
              <Text style={styles.actionLinkText}>Initialize Exercise Grid →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}