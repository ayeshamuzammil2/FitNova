import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { globalStyles } from '../../styles/globalStyles';

const localWeeklyRoutine = [
  {
    day: "Monday",
    focus: "Core Stability & Calisthenics Baseline",
    cardio: "15 Mins Jump Rope",
    precaution: "Keep spine strictly neutral during plank activations.",
    dietPlan: {
      breakfast: ["Oats", "Raw Honey", "Almond Milk"],
      lunch: ["Salad Wrap", "Boiled Chickpeas"],
      snacks: ["Mixed Nuts", "Green Tea"],
      dinner: ["Boiled Chicken", "Sautéed Spinach"],
      beforeSleep: ["Warm Water with Lemon"]
    },
    exercises: [
      { id: "ft_m1", name: "Forearm Plank Hold", details: "4 Sets x 60 Reps", image: require('../../../assets/images/monday1.jpg') },
      { id: "ft_m2", name: "Bodyweight Push-Ups", details: "4 Sets x 15 Reps", image: require('../../../assets/images/monday2.jpg') },
      { id: "ft_m3", name: "Hanging Knee Raises", details: "4 Sets x 12 Reps", image: require('../../../assets/images/monday3.jpg') },
      { id: "ft_m4", name: "Superman Extensions", details: "3 Sets x 15 Reps", image: require('../../../assets/images/monday4.jpg') }
    ]
  },
  {
    day: "Tuesday",
    focus: "Lower Body Mobility & Kinetic Balance",
    cardio: "20 Mins Low Intensity Cycle",
    precaution: "Do not allow knees to cave inward during stability alignment.",
    dietPlan: {
      breakfast: ["Chia Pudding", "1 Banana"],
      lunch: ["Quinoa Bowl", "Steamed Tofu / Fish", "Salad"],
      snacks: ["Apple Slices", "Peanut Butter"],
      dinner: ["Lentil Soup", "Baked Sweet Potato"],
      beforeSleep: ["Chamomile Tea"]
    },
    exercises: [
      { id: "ft_tu1", name: "Air Squats (Tempo Controlled)", details: "4 Sets x 20 Reps", image: require('../../../assets/images/tuesday1.jpg') },
      { id: "ft_tu2", name: "Static Bodyweight Lunges", details: "4 Sets x 12 Reps", image: require('../../../assets/images/tuesday2.jpg') },
      { id: "ft_tu3", name: "Glute Bridges", details: "4 Sets x 15 Reps", image: require('../../../assets/images/tuesday3.jpg') },
      { id: "ft_tu4", name: "Wall Sit Hold Calibration", details: "3 Sets x 45 Reps", image: require('../../../assets/images/tuesday4.jpg') }
    ]
  },
  {
    day: "Wednesday",
    focus: "Upper Body Endurance & Postural Alignment",
    cardio: "15 Mins Brisk Rowing Machine",
    precaution: "Engage the scapula properly; avoid rounded shoulders.",
    dietPlan: {
      breakfast: ["Muesli", "Greek Yogurt"],
      lunch: ["Whole Wheat Tuna Wrap", "Orange Juice"],
      snacks: ["Walnuts", "Roasted Chickpeas"],
      dinner: ["Grilled Chicken Salad", "Avocado Slice"],
      beforeSleep: ["Herbal Infusion"]
    },
    exercises: [
      { id: "ft_w1", name: "Incline Push-Ups Node", details: "4 Sets x 15 Reps", image: require('../../../assets/images/wednesday1.jpg') },
      { id: "ft_w2", name: "Bodyweight Bench Dips", details: "4 Sets x 12 Reps", image: require('../../../assets/images/wednesday2.jpg') },
      { id: "ft_w3", name: "Pike Push-Ups (Shoulder Focus)", details: "3 Sets x 10 Reps", image: require('../../../assets/images/wednesday3.jpg') },
      { id: "ft_w4", name: "Prone Y-T-W Extensions", details: "3 Sets x 12 Reps", image: require('../../../assets/images/wednesday4.jpg') }
    ]
  },
  {
    day: "Thursday",
    focus: "Absolute Core Compression & Oblique Calibration",
    cardio: "20 Mins High Knee Row Walk",
    precaution: "Press lower back firmly into the floor map layout.",
    dietPlan: {
      breakfast: ["Scrambled Egg Whites", "Brown Toast"],
      lunch: ["Chicken caesar Salad (Light)"],
      snacks: ["Pumpkin Seeds", "Matcha Tea"],
      dinner: ["Baked Cod Fish", "Asparagus Grid"],
      beforeSleep: ["Warm Almond Milk"]
    },
    exercises: [
      { id: "ft_th1", name: "Bicycle Crunches Fast Split", details: "4 Sets x 20 Reps", image: require('../../../assets/images/thursday1.jpg') },
      { id: "ft_th2", name: "Russian Twists Protocol", details: "4 Sets x 24 Total Reps", image: require('../../../assets/images/thursday2.jpg') },
      { id: "ft_th3", name: "Dead Bug Matrix Balance", details: "3 Sets x 12 Reps", image: require('../../../assets/images/thursday3.jpg') },
      { id: "ft_th4", name: "Mountain Climbers Sprint", details: "4 Sets x 30 Reps", image: require('../../../assets/images/thursday4.jpg') }
    ]
  },
  {
    day: "Friday",
    focus: "Full Body Agility & Calisthenics Volumetric",
    cardio: "15 Mins Cross Trainer Matrix",
    precaution: "Flex your knees upon landing to safely absorb the impact shock.",
    dietPlan: {
      breakfast: ["Oatmeal", "Flaxseeds", "Berries"],
      lunch: ["Turkey Salad Wrap", "Tomato Soup"],
      snacks: ["Cottage Cheese / Paneer Node"],
      dinner: ["Steamed Salmon", "Broccoli Crowns"],
      beforeSleep: ["Boiled Egg Whites"]
    },
    exercises: [
      { id: "ft_f1", name: "Burpees Acceleration Node", details: "4 Sets x 10 Reps", image: require('../../../assets/images/friday1.jpg') },
      { id: "ft_f2", name: "Jumping Jacks Volume", details: "4 Sets x 40 Reps", image: require('../../../assets/images/friday2.jpg') },
      { id: "ft_f3", name: "Bear Crawls Control Split", details: "3 Sets x 15 Reps", image: require('../../../assets/images/friday3.jpg') },
      { id: "ft_f4", name: "Diamond Pushups Progression", details: "3 Sets x 12 Reps", image: require('../../../assets/images/friday4.jpg') }
    ]
  },
  {
    day: "Saturday",
    focus: "Posterior Chain Flexion & Isometric Recovery",
    cardio: "20 Mins Stepper Sync Walk",
    precaution: "Squeeze glutes fully at the top of each expansion layout.",
    dietPlan: {
      breakfast: ["Fruit Smoothie Bowl", "Chia Seeds"],
      lunch: ["Brown Rice Grid", "Boiled Daal / Lentils"],
      snacks: ["Mixed Dry Fruits Blend", "Black Coffee"],
      dinner: ["Tofu Stir-fry / Grilled Chicken", "Mixed Veggies"],
      beforeSleep: ["Peppermint Relax Tea"]
    },
    exercises: [
      { id: "ft_s1", name: "Single-Leg Glute Bridges", details: "4 Sets x 12 Reps", image: require('../../../assets/images/saturday1.jpg') },
      { id: "ft_s2", name: "Bird-Dog Isometric Holds", details: "4 Sets x 12 Reps", image: require('../../../assets/images/saturday2.jpg') },
      { id: "ft_s3", name: "Good Mornings (Bodyweight Setup)", details: "3 Sets x 15 Reps", image: require('../../../assets/images/saturday3.jpg') },
      { id: "ft_s4", name: "Donkey Kicks Activation Matrix", details: "4 Sets x 15 Reps", image: require('../../../assets/images/saturday4.jpg') }
    ]
  }
];

export default function DailyTrackingFitnessScreen({ navigation }) {
  const { currentTheme, isDarkMode } = useAppTheme();
  const styles = useMemo(() => globalStyles(currentTheme), [currentTheme]);

  const [initialWeight, setInitialWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [blockPopupVisible, setBlockPopupVisible] = useState(false);
  const [inputMissingVisible, setInputMissingVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 
  const [weeklyLogs, setWeeklyLogs] = useState({});
  const [localExercisesData, setLocalExercisesData] = useState({});
  const [nutritionChecked, setNutritionChecked] = useState(null);

  const modalScrollRef = useRef(null);

  const currentAuditDay = localWeeklyRoutine[currentStepIndex];
  const trackedDaysCount = Object.keys(weeklyLogs).length;

  useEffect(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [currentStepIndex]);

  const calculateEstimates = () => {
    let exercisePoints = 0;
    let dietPoints = 0;
    const totalPossibleDays = localWeeklyRoutine.length;

    Object.keys(weeklyLogs).forEach(day => {
      const log = weeklyLogs[day];
      if (log.exercises && Object.keys(log.exercises).length > 0) {
        exercisePoints += 1;
      }
      if (log.nutrition === true) {
        dietPoints += 1;
      }
    });

    const workoutScore = (exercisePoints / totalPossibleDays) * 100;
    const dietScore = (dietPoints / totalPossibleDays) * 100;
    const overallAdherence = (workoutScore + dietScore) / 2;

    const maxLossPotential = 1.2; 
    const estimatedLoss = (overallAdherence / 100) * maxLossPotential;

    return {
      workoutScore: workoutScore.toFixed(0),
      dietScore: dietScore.toFixed(0),
      estimatedLoss: estimatedLoss.toFixed(2),
      overallAdherence: overallAdherence.toFixed(0)
    };
  };

  const estimates = calculateEstimates();

  const handleOpenDayPopup = (index) => {
    setCurrentStepIndex(index);
    loadStepData(index);
    setAuditModalVisible(true);
  };

  const loadStepData = (index) => {
    const dayName = localWeeklyRoutine[index].day;
    const existingLog = weeklyLogs[dayName] || {};
    setLocalExercisesData(existingLog.exercises || {});
    setNutritionChecked(existingLog.nutrition !== undefined ? existingLog.nutrition : null);
  };

  const handleExerciseInputChange = (exId, field, value) => {
    setLocalExercisesData(prev => ({
      ...prev,
      [exId]: { ...prev[exId], [field]: value }
    }));
  };

  const handleNextStep = () => {
    setWeeklyLogs(prev => ({
      ...prev,
      [currentAuditDay.day]: { exercises: localExercisesData, nutrition: nutritionChecked }
    }));

    if (currentStepIndex < localWeeklyRoutine.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextDayName = localWeeklyRoutine[nextIndex].day;
      const nextLog = weeklyLogs[nextDayName] || {};
      setLocalExercisesData(nextLog.exercises || {});
      setNutritionChecked(nextLog.nutrition !== undefined ? nextLog.nutrition : null);
    } else {
      setAuditModalVisible(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevDayName = localWeeklyRoutine[prevIndex].day;
      const prevLog = weeklyLogs[prevDayName] || {};
      setLocalExercisesData(prevLog.exercises || {});
      setNutritionChecked(prevLog.nutrition !== undefined ? prevLog.nutrition : null);
    }
  };

  const calculateProgressDelta = () => {
    const initial = parseFloat(initialWeight);
    const current = parseFloat(currentWeight);
    if (isNaN(initial) || isNaN(current)) return '0.0';
    return (initial - current).toFixed(1);
  };

  const handleGenerateReportClick = () => {
    // 1. Check if user logged at least 1 routine day
    if (trackedDaysCount === 0) {
      setBlockPopupVisible(true);
      return;
    }

    // 2. Check if weights parameters are empty
    if (!initialWeight.trim() || !currentWeight.trim()) {
      setInputMissingVisible(true);
      return;
    }

    setShowReport(true);
  };

  const handlePrintReport = async () => {
    try {
      const actualAchieved = calculateProgressDelta();
      const warningMessage = parseFloat(actualAchieved) > 0 && estimates.overallAdherence === "0" 
        ? "Warning: Actual calibration shifted without logging routine adherence. Please audit workout metrics for authentic telemetry data verification."
        : "Analysis Complete: Reality metrics successfully verified against functional system tracking nodes.";

      let dayRowsHtml = '';
      localWeeklyRoutine.forEach(item => {
        const customLog = weeklyLogs[item.day];
        const status = customLog ? `Logged (${Object.keys(customLog.exercises || {}).length > 0 ? "Active" : "Empty"})` : 'Not Logged';
        const dietStatus = customLog && customLog.nutrition !== null ? (customLog.nutrition ? "✓ Taken" : "✕ Missed") : "N/A";
        
        dayRowsHtml += `
          <tr>
            <td><strong>${item.day}</strong></td>
            <td>${item.focus}</td>
            <td>${status}</td>
            <td>${dietStatus}</td>
          </tr>
        `;
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Fitness Functional Architecture Evaluation Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 30px; }
            .header { text-align: center; border-bottom: 3px solid #00A8FF; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #0f172a; font-size: 28px; text-transform: uppercase; letter-spacing: 1px; }
            .header p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; }
            .section-title { font-size: 18px; color: #00A8FF; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 25px; margin-bottom: 15px; font-weight: bold; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; margin: 0 10px; }
            .card.highlight { border-color: #00A8FF; background: #f0f9ff; }
            .card h3 { margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase; }
            .card p { margin: 0; font-size: 22px; font-weight: bold; color: #0f172a; }
            .card.highlight p { color: #00A8FF; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 13px; }
            th { background-color: #f1f5f9; color: #334155; font-weight: bold; }
            .footer-note { background: #fffbeb; border: 1px solid #fef3c7; color: #b45309; padding: 15px; border-radius: 8px; font-style: italic; margin-top: 30px; font-size: 13px; text-align: center; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Fitness Architecture Tracker Node</h1>
            <p>Core Stability & Calisthenics Adherence Profile</p>
          </div>

          <div class="section-title">Consistency & Adherence Metrics</div>
          <div class="grid">
            <div class="card">
              <h3>Functional Adherence</h3>
              <p>${estimates.workoutScore}%</p>
            </div>
            <div class="card">
              <h3>Diet Compliance</h3>
              <p>${estimates.dietScore}%</p>
            </div>
            <div class="card">
              <h3>Overall Consistency</h3>
              <p>${estimates.overallAdherence}%</p>
            </div>
          </div>

          <div class="section-title">Biometric Metric Evaluation</div>
          <div class="grid">
            <div class="card">
              <h3>Baseline Weight</h3>
              <p>${initialWeight ? initialWeight + ' KG' : 'N/A'}</p>
            </div>
            <div class="card">
              <h3>Current Weight</h3>
              <p>${currentWeight ? currentWeight + ' KG' : 'N/A'}</p>
            </div>
            <div class="card">
              <h3>Projected Shifts</h3>
              <p>${estimates.estimatedLoss} KG</p>
            </div>
            <div class="card highlight">
              <h3>Actual Variance</h3>
              <p>${actualAchieved} KG</p>
            </div>
          </div>

          <div class="section-title">Weekly Routine Execution Log</div>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Focus Matrix</th>
                <th>Workout Status</th>
                <th>Diet Audit</th>
              </tr>
            </thead>
            <tbody>
              ${dayRowsHtml}
            </tbody>
          </table>

          <div class="footer-note">
            ${warningMessage}
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    } catch (error) {
      Alert.alert("Error", "Could not generate or print the report. Please check system context permissions.");
      console.error(error);
    }
  };

  const overlayBackground = isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(241, 245, 249, 0.95)';

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      
      {/* MAIN AUDIT INPUT MODAL */}
      <Modal visible={auditModalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: overlayBackground, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10 }}>
          <View style={[styles.widgetActive, { width: '98%', maxWidth: 1100, height: '97%', padding: 24, position: 'relative' }]}>
            
            <TouchableOpacity 
              style={{ position: 'absolute', top: 15, right: 15, zIndex: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 8, borderRadius: 20 }}
              onPress={() => setAuditModalVisible(false)}
            >
              <Text style={{ color: currentTheme.error, fontWeight: 'bold', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginRight: 30 }}>
              <Text style={[styles.widgetTitle, { color: currentTheme.textLight, fontSize: 24 }]}>{currentAuditDay?.day}</Text>
              <Text style={[styles.tagText, { fontSize: 14 }]}>{currentStepIndex + 1} / {localWeeklyRoutine.length}</Text>
            </View>

            <ScrollView ref={modalScrollRef} showsVerticalScrollIndicator={false} style={{ width: '100%', marginBottom: 10 }}>
              <Text style={[styles.mutedText, { fontSize: 15, fontWeight: 'bold', marginBottom: 15, color: currentTheme.textLight }]}>
                Focus Matrix: {currentAuditDay?.focus}
              </Text>

              {currentAuditDay?.exercises.map((ex, idx) => {
                const exLogs = localExercisesData[ex.id] || { sets: '', reps: '' };
                return (
                  <View key={ex.id} style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)', padding: 14, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: currentTheme.border }}>
                    <Text style={[styles.bodyText, { fontWeight: 'bold', fontSize: 15 }]}>
                      {idx + 1}. {ex.name}
                    </Text>
                    <Text style={[styles.mutedText, { fontSize: 12, marginBottom: 8 }]}>
                      Target Setup: {ex.details}
                    </Text>
                    
                    <Image source={ex.image} style={{ width: '100%', height: 160, borderRadius: 12, backgroundColor: '#FFFFFF', marginTop: 4, marginBottom: 12 }} resizeMode="contain" />

                    <View style={{ borderTopWidth: 0.5, borderColor: currentTheme.border, paddingTop: 10 }}>
                      <Text style={{ color: currentTheme.textLight, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>SETS COMPLETED:</Text>
                      <TextInput 
                        style={[styles.input, { height: 42, marginBottom: 8, fontSize: 13, backgroundColor: currentTheme.background }]} 
                        placeholder="e.g. 4" placeholderTextColor={currentTheme.textGray} keyboardType="numeric" value={exLogs.sets}
                        onChangeText={(val) => handleExerciseInputChange(ex.id, 'sets', val)}
                      />

                      <Text style={{ color: currentTheme.textLight, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>REPETITIONS:</Text>
                      <TextInput 
                        style={[styles.input, { height: 42, fontSize: 13, backgroundColor: currentTheme.background }]} 
                        placeholder="e.g. 12" placeholderTextColor={currentTheme.textGray} keyboardType="numeric" value={exLogs.reps}
                        onChangeText={(val) => handleExerciseInputChange(ex.id, 'reps', val)}
                      />
                    </View>
                  </View>
                );
              })}

              <Text style={[styles.mutedText, { fontSize: 14, marginBottom: 15, fontWeight: 'bold', color: currentTheme.textLight }]}>
                🏃‍♂️ Cardio Task: {currentAuditDay?.cardio}
              </Text>

              <View style={{ backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : '#FFFFFF', padding: 15, borderRadius: 14, marginBottom: 15, borderWidth: 1, borderColor: currentTheme.border }}>
                <Text style={{ color: currentTheme.textLight, fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>🥗 DIET PROFILE TARGETS</Text>
                {currentAuditDay?.dietPlan && Object.keys(currentAuditDay.dietPlan).map((mealType) => {
                  const mealTitle = mealType.replace(/([A-Z])/g, ' $1').toUpperCase();
                  return (
                    <View key={mealType} style={{ marginBottom: 8, borderBottomWidth: 0.5, borderColor: currentTheme.border, paddingBottom: 6 }}>
                      <Text style={{ color: currentTheme.textLight, fontWeight: '700', fontSize: 11, marginBottom: 2 }}>{mealTitle}:</Text>
                      <Text style={{ color: currentTheme.textGray, fontSize: 13 }}>{currentAuditDay.dietPlan[mealType].join(' • ')}</Text>
                    </View>
                  );
                })}
              </View>
              
              <Text style={[styles.mutedText, { fontSize: 12, fontStyle: 'italic', marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.03)', padding: 10, borderRadius: 8, color: currentTheme.textLight }]}>
                ⚠️ Safety Architecture: {currentAuditDay?.precaution}
              </Text>

              <View style={{ borderTopWidth: 1, borderColor: currentTheme.border, paddingTop: 15 }}>
                <Text style={[styles.mutedText, { fontWeight: 'bold', marginBottom: 10, color: currentTheme.textLight }]}>WHOLE DAY NUTRITION COMPLIANCE AUDIT:</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <TouchableOpacity 
                    style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: currentTheme.primary, backgroundColor: nutritionChecked === true ? 'rgba(255,255,255,0.05)' : 'transparent', marginRight: 8, alignItems: 'center' }}
                    onPress={() => setNutritionChecked(true)}
                  >
                    <Text style={{ color: currentTheme.textLight, fontWeight: 'bold', fontSize: 12 }}>DIET TAKEN ✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: currentTheme.error, backgroundColor: nutritionChecked === false ? 'rgba(239, 68, 68, 0.1)' : 'transparent', marginLeft: 8, alignItems: 'center' }}
                    onPress={() => setNutritionChecked(false)}
                  >
                    <Text style={{ color: currentTheme.error, fontWeight: 'bold', fontSize: 12 }}>DIET MISSED ✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 16, borderTopWidth: 1, borderColor: currentTheme.border, gap: 12 }}>
  
  <TouchableOpacity 
    style={[styles.btn, { flex: 1, marginTop: 0, opacity: currentStepIndex === 0 ? 0.3 : 1 }]} 
    disabled={currentStepIndex === 0} 
    onPress={handlePreviousStep}
    activeOpacity={0.85}
  >
    <Text style={styles.btnText}>← Back</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={[styles.btn, { flex: 1.5, marginTop: 0 }]} 
    onPress={handleNextStep}
    activeOpacity={0.85}
  >
    <Text style={styles.btnText}>
      {currentStepIndex === localWeeklyRoutine.length - 1 ? "FINISH LOG" : "NEXT DAY →"}
    </Text>
  </TouchableOpacity>

</View>

          </View>
        </View>
      </Modal>

      {/* CUSTOM ALERT POPUP MODAL (ROUTINE UNLOGGED BLOCKER) */}
      <Modal visible={blockPopupVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: currentTheme.background, padding: 25, borderRadius: 20, width: '90%', maxWidth: 400, borderWidth: 1.5, borderColor: currentTheme.error, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🔒</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: currentTheme.error, textAlign: 'center', marginBottom: 12, letterSpacing: 0.5 }}>
              Action Required: Adherence Incomplete!
            </Text>
            <Text style={{ color: currentTheme.textLight, fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 21, opacity: 0.9 }}>
              You cannot view or generate your progress report because you haven't followed or logged your routine yet. Please initialize your daily workout matrix and check your nutrition log first.
            </Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: currentTheme.error, width: '100%', marginTop: 0, minHeight: 48, paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }]}
              onPress={() => setBlockPopupVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnText, { fontWeight: '500', fontSize: 13, textAlign: 'center', flexWrap: 'wrap' }]}>
                UNDERSTOOD & GO BACK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CUSTOM INPUT MISSING POPUP MODAL (WEIGHT MISSING VALUE ERROR) */}
      <Modal visible={inputMissingVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: currentTheme.background, padding: 25, borderRadius: 20, width: '90%', maxWidth: 400, borderWidth: 1.5, borderColor: '#FFB300', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>⚠️</Text>
            <Text style={{ fontSize: 19, fontWeight: '900', color: '#FFB300', textAlign: 'center', marginBottom: 12 }}>
              Metrics Baseline Missing
            </Text>
            <Text style={{ color: currentTheme.textLight, fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 21 }}>
              Please fill both parameters: Baseline Weight and Current Re-calibrated Weight inputs to successfully register your analytics data.
            </Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#FFB300', width: '100%', marginTop: 0, height: 48, borderRadius: 12 }]}
              onPress={() => setInputMissingVisible(false)}
            >
              <Text style={[styles.btnText, { color: '#000', fontWeight: '700' }]}>COMPLETE INPUTS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.topRow}>
        <TouchableOpacity style={styles.accountBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={[styles.bodyText, { color: currentTheme.textLight, fontSize: 12, fontWeight: '600' }]}>← BACK TO BASE</Text>
        </TouchableOpacity>
        <Text style={styles.tagText}>ATHLETE TRACKING NODE</Text>
      </View>

      <Text style={[styles.title, { marginBottom: 4 }]}>Fitness & Functional Architecture</Text>
      <Text style={[styles.subTitle, { marginBottom: 20 }]}>6-Day Calisthenics Core & Stability Grid</Text>

      <View style={styles.widgetActive}>
        <Text style={[styles.widgetTitle, { fontSize: 16, marginBottom: 6 }]}>Weekly Architecture Logs Registry</Text>
        <Text style={[styles.mutedText, { textAlign: 'center', marginBottom: 15 }]}>
          {trackedDaysCount > 0 ? `Telemetry recorded for ${trackedDaysCount} out of ${localWeeklyRoutine.length} routine nodes.` : 'No metrics loaded for the current cycle session.'}
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => handleOpenDayPopup(0)} activeOpacity={0.85}>
          <Text style={styles.btnText}>
            {trackedDaysCount > 0 ? "RE-ENTER WEEKLY AUDIT" : "INITIALIZE WEEKLY AUDIT"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.mutedText, { fontWeight: 'bold', marginBottom: 12, color: currentTheme.textLight }]}>SELECT DAY TO VIEW OR AUDIT:</Text>
      <View style={{ marginBottom: 25 }}>
        {localWeeklyRoutine.map((item, index) => {
          const customLog = weeklyLogs[item.day];
          return (
            <TouchableOpacity 
              key={item.day} 
              style={[customLog ? styles.widgetActive : styles.widget, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginBottom: 10 }]}
              onPress={() => handleOpenDayPopup(index)}
              activeOpacity={0.9}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.widgetTitle, { fontSize: 16 }]}>{item.day}</Text>
                <Text style={[styles.mutedText, { fontSize: 12, marginTop: 2 }]}>{item.focus}</Text>
                {customLog && (
                  <Text style={{ color: currentTheme.primary, fontSize: 11, fontWeight: 'bold', marginTop: 4 }}>
                    ✓ Status: Logged {Object.keys(customLog.exercises || {}).length > 0 ? "Active" : "Empty"} {customLog.nutrition !== null ? `| Diet: ${customLog.nutrition ? "✓" : "✕"}` : ""}
                  </Text>
                )}
              </View>
              <Text style={{ color: currentTheme.primary, fontWeight: 'bold' }}>VIEW →</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.widgetActive, { marginBottom: 25, borderColor: '#00A8FF', borderWidth: 1.5, padding: 20 }]}>
        <Text style={[styles.widgetTitle, { color: '#00A8FF', fontSize: 18, marginBottom: 5 }]}>📊 Predictive Metric Alignment</Text>
        <Text style={[styles.mutedText, { marginBottom: 15 }]}>AI parameters adjusted based on recorded calisthenics consistency.</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: currentTheme.textLight }}>Workout Adherence:</Text>
          <Text style={{ color: currentTheme.textLight, fontWeight: 'bold' }}>{estimates.workoutScore}%</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: currentTheme.textLight }}>Diet Compliance:</Text>
          <Text style={{ color: currentTheme.textLight, fontWeight: 'bold' }}>{estimates.dietScore}%</Text>
        </View>
        <View style={{ height: 1, backgroundColor: currentTheme.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: currentTheme.textLight, fontWeight: '700' }}>Projected Body Sync:</Text>
          <Text style={{ color: '#00A8FF', fontWeight: '900', fontSize: 18 }}>{estimates.estimatedLoss} KG</Text>
        </View>
      </View>

      <View style={[styles.widget, { marginTop: 10, padding: 25 }]}>
        <Text style={[styles.widgetTitle, { marginBottom: 15 }]}>Progress Analytics Hub</Text>
        <TextInput style={styles.input} placeholder="Baseline Weight (kg)" placeholderTextColor={currentTheme.textGray} keyboardType="numeric" value={initialWeight} onChangeText={setInitialWeight} />
        
        <Text style={{ color: currentTheme.textLight, fontSize: 12, fontWeight: '700', marginBottom: 5, marginTop: 5 }}>ENTER ACTUAL RE-CALIBRATED WEIGHT:</Text>
        <TextInput style={styles.input} placeholder="Current Weight (kg)" placeholderTextColor={currentTheme.textGray} keyboardType="numeric" value={currentWeight} onChangeText={setCurrentWeight} />

        <TouchableOpacity style={styles.btn} onPress={handleGenerateReportClick} activeOpacity={0.85}>
          <Text style={styles.btnText}>GENERATE REPORT</Text>
        </TouchableOpacity>
      </View>

      {showReport && (
        <View style={[styles.widgetActive, { marginTop: 20, padding: 25 }]}>
          <Text style={[styles.widgetTitle, { marginBottom: 15 }]}>Weekly Telemetry Evaluation</Text>
          <Text style={[styles.bodyText, { marginBottom: 8 }]}>Calculated Consistency Rate: <Text style={{ fontWeight: 'bold', color: '#00A8FF' }}>{estimates.overallAdherence}%</Text></Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 10, alignItems: 'center', marginRight: 5, borderWidth: 1, borderColor: currentTheme.border }}>
              <Text style={{ color: currentTheme.textGray, fontSize: 10, textAlign: 'center' }}>PROJECTED SHIFT</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: currentTheme.textLight, marginTop: 5 }}>{estimates.estimatedLoss} KG</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: 'rgba(0, 168, 255, 0.05)', padding: 12, borderRadius: 10, alignItems: 'center', marginLeft: 5, borderWidth: 1, borderColor: '#00A8FF' }}>
              <Text style={{ color: '#00A8FF', fontSize: 10, textAlign: 'center' }}>ACTUAL ACHIEVED</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: currentTheme.textLight, marginTop: 5 }}>{calculateProgressDelta()} KG</Text>
            </View>
          </View>

          <Text style={{ color: currentTheme.textGray, fontSize: 13, marginTop: 15, fontStyle: 'italic', textAlign: 'center', lineHeight: 18 }}>
            {parseFloat(calculateProgressDelta()) > 0 && estimates.overallAdherence === "0" 
              ? "⚠️ Warning: Actual variance registered without logging routine adherence. Please audit workout metrics for authentic calibration."
              : "✓ Analysis Complete: Reality metrics successfully compared against system tracking profiles."}
          </Text>

          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#00A8FF', marginTop: 20 }]} 
            onPress={handlePrintReport}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>🖨️ PRINT REPORT</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}