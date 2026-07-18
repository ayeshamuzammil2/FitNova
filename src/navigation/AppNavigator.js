import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import WeeklyReportScreen from '../screens/Report/WeeklyReportScreen';
import DailyTrackingCardioScreen from '../screens/Workout/DailyTrackingCardioScreen';
import DailyTrackingFitnessScreen from '../screens/Workout/DailyTrackingFitnessScreen';
import DailyTrackingGymScreen from '../screens/Workout/DailyTrackingGymScreen';
import WorkoutCategoryScreen from '../screens/Workout/WorkoutCategoryScreen';

// Firebase database core write capability initialization
import { getDatabase, ref, update } from "firebase/database";

// Navigation instances initialization
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

/**
 * TabNavigator: Handles main application layout interfaces.
 * Fixed padding alignment to keep text labels vertically and horizontally center without layout layout distortion.
 */
function TabNavigator() {
  const { currentTheme } = useAppTheme();
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        
        // Tab Icon ko completely bypass karne ka best tareeqa taake text center alignment kharab na ho
        tabBarIcon: () => null, 
        
        // Main Tab Bar Area Alignment Custom Adjustments
        tabBarStyle: { 
          backgroundColor: currentTheme.secondary, 
          borderTopWidth: 0, 
          height: 65,                // Height optimized for labels padding adjustment
          paddingBottom: 0,          // Removes default OS specific shift overrides
          elevation: 8,              // Android shadow clean separation
          shadowColor: '#000000',    // iOS shadow separation 
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        
        // Exact text labeling positioning parameters (Perfect Clean Horizontal/Vertical Alignment)
        tabBarLabelStyle: {
          fontSize: 15, 
          fontWeight: '700',
          width: '100%',
          textAlign: 'center',
          alignSelf: 'center',
          lineHeight: 65,            // Line height matches tab height to naturally center item vertically
        },
        
        // Single structural container item containment configuration
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        },
        tabBarActiveTintColor: '#1d97d4',
        tabBarInactiveTintColor: currentTheme.textGray,
      }}
    >
      <Tab.Screen name="MainDashboard" component={DashboardScreen} options={{ title: 'Home 🏠' }} />
      <Tab.Screen name="WeeklyReportTab" component={WeeklyReportScreen} options={{ title: 'Analytics 📊' }} />
    </Tab.Navigator>
  );
}

/**
 * CustomDrawerContent: Side portal dashboard workspace menu layout structure.
 * Supports dynamic context theme swapping and local state inputs validation for biometrics changes.
 */
function CustomDrawerContent(props) {
  const { currentTheme, toggleTheme, isDarkMode } = useAppTheme();
  const { currentUser, setCurrentUser } = useUser();
  const accentColor = isDarkMode ? '#D6BD98' : '#1d97d4'; 

  // UI state tracking variables initialization
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editHeight, setEditHeight] = useState('');

  // Hydrate input forms state data when active session payload shifts
  useEffect(() => {
    if (currentUser) {
      setEditUsername(currentUser.username || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || ''); 
      setEditWeight(currentUser.weight || '');
      setEditHeight(currentUser.height || '');
    }
  }, [currentUser]);

  // Color mapping config processing for conditional visual styling markers
  const getStatusBadgeColor = (status) => {
    if (status === 'NORMAL WEIGHT') return '#1d97d4'; 
    if (status === 'UNDERWEIGHT') return '#F59E0B'; 
    if (status === 'OVERWEIGHT') return '#EF4444'; 
    return currentTheme.textGray;
  };

  // Processing input fields and syncing configuration metrics to real-time database
  const handleSaveProfile = async () => {
    // Explicit system requirement checks validation barrier
    if (!editUsername.trim() || !editEmail.trim() || !editWeight.toString().trim() || !editHeight.toString().trim()) {
      const msg = "Username, Email, Weight, and Height are explicitly required!";
      if (Platform.OS === 'web') alert(`Error:\n\n${msg}`);
      else Alert.alert("Required Fields Missing ⚠️", msg);
      return;
    }

    let updatedBmiScore = '--';
    let updatedHealthStatus = 'PENDING';

    const weightKg = parseFloat(editWeight);
    const feet = parseFloat(editHeight);

    // Compute updated body mass analytics configuration mathematically
    if (!isNaN(weightKg) && !isNaN(feet) && feet > 0) {
      const heightInMeters = feet * 0.3048;
      const bmi = weightKg / (heightInMeters * heightInMeters);
      updatedBmiScore = bmi.toFixed(1);
      
      if (bmi < 18.5) updatedHealthStatus = 'UNDERWEIGHT';
      else if (bmi >= 18.5 && bmi <= 24.9) updatedHealthStatus = 'NORMAL WEIGHT';
      else updatedHealthStatus = 'OVERWEIGHT';
    }

    // Live sync mutations targeting production cloud database reference node path
    if (currentUser?.uid) {
      try {
        const db = getDatabase();
        await update(ref(db, `users/${currentUser.uid}`), {
          username: editUsername,
          email: editEmail,
          phone: editPhone,
          weight: editWeight.toString().trim(),
          height: editHeight.toString().trim(),
          bmiScore: updatedBmiScore,
          healthStatus: updatedHealthStatus
        });

        setIsEditing(false); // Disable interactive mutation context state views
        const successMsg = "Profile Realtime Calibration Sync Completed!";
        if (Platform.OS === 'web') alert(`Success:\n\n${successMsg}`);
        else Alert.alert("Profile Synchronized 🎉", successMsg);
      } catch (err) {
        console.error("Sidebar Sync Error: ", err.message);
      }
    }
  };

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: currentTheme.secondary }}>
      {/* Profile Header Block Area Section */}
      <View style={{ padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#1F293D' : '#E2E8F0', marginBottom: 15 }}>
        <View style={{ width: 70, height: 70, borderRadius: 24, backgroundColor: accentColor, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: isDarkMode ? '#0B0F19' : '#FFFFFF' }}>
            {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'A'}
          </Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: '800', color: currentTheme.textLight, textAlign: 'center' }}>
          {currentUser?.username || 'Athlete Portal'}
        </Text>
        <Text style={{ fontSize: 12, color: currentTheme.textGray, marginTop: 2 }}>
          {currentUser?.email || 'active@fitnova.com'}
        </Text>
        
        {/* Toggle Form Component Interactive Trigger Switch Controller Button */}
        <TouchableOpacity 
          style={{ marginTop: 14, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: isDarkMode ? '#1F293D' : '#E2E8F0', width: '100%', alignItems: 'center' }}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={{ fontSize: 12, fontWeight: '800', color: accentColor }}>
            {isEditing ? 'Cancel & Close ❌' : 'Edit Account & Profile ⚙️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Dynamic View Conditional Context Layout Blocks based on isEditing state */}
      {isEditing ? (
        <View style={{ paddingHorizontal: 16, marginBottom: 15 }}>
          <View style={{ backgroundColor: isDarkMode ? '#0B0F19' : '#F8FAFC', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: accentColor }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: accentColor, letterSpacing: 1, marginBottom: 12 }}>EDIT ACCOUNT DETAILS</Text>
            
            <Text style={{ color: currentTheme.textLight, fontSize: 11, marginBottom: 4, fontWeight: '600' }}>Username *:</Text>
            <TextInput 
              style={{ backgroundColor: isDarkMode ? '#1F293D' : '#FFFFFF', color: currentTheme.textLight, padding: 8, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: currentTheme.border, fontSize: 13 }}
              value={editUsername}
              onChangeText={setEditUsername}
            />

            <Text style={{ color: currentTheme.textLight, fontSize: 11, marginBottom: 4, fontWeight: '600' }}>Email Address *:</Text>
            <TextInput 
              style={{ backgroundColor: isDarkMode ? '#1F293D' : '#FFFFFF', color: currentTheme.textLight, padding: 8, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: currentTheme.border, fontSize: 13 }}
              keyboardType="email-address"
              value={editEmail}
              onChangeText={setEditEmail}
            />

            <Text style={{ fontSize: 11, fontWeight: '800', color: accentColor, letterSpacing: 1, marginBottom: 10, marginTop: 5 }}>BIOMETRICS SYSTEM (REQUIRED)</Text>

            <Text style={{ color: currentTheme.textLight, fontSize: 11, marginBottom: 4, fontWeight: '600' }}>Weight (KG) *:</Text>
            <TextInput 
              style={{ backgroundColor: isDarkMode ? '#1F293D' : '#FFFFFF', color: currentTheme.textLight, padding: 8, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: currentTheme.border, fontSize: 13 }}
              keyboardType="numeric"
              value={editWeight.toString()}
              onChangeText={setEditWeight}
            />

            <Text style={{ color: currentTheme.textLight, fontSize: 11, marginBottom: 4, fontWeight: '600' }}>Height (Feet) *:</Text>
            <TextInput 
              style={{ backgroundColor: isDarkMode ? '#1F293D' : '#FFFFFF', color: currentTheme.textLight, padding: 8, borderRadius: 8, marginBottom: 14, borderWidth: 1, borderColor: currentTheme.border, fontSize: 13 }}
              keyboardType="numeric"
              value={editHeight.toString()}
              onChangeText={setEditHeight}
            />

            <TouchableOpacity 
              style={{ backgroundColor: '#1d97d4', padding: 12, borderRadius: 8, alignItems: 'center' }}
              onPress={handleSaveProfile}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Sync Biometrics ✅</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Real-Time Metrics Display Board Container Block */
        <View style={{ paddingHorizontal: 16, marginBottom: 15 }}>
          <View style={{ backgroundColor: isDarkMode ? '#0B0F19' : '#F8FAFC', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: currentTheme.border }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: accentColor, letterSpacing: 1 }}>REALTIME CALIBRATION</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderBottomWidth: 0.5, borderColor: currentTheme.border, paddingBottom: 6 }}>
              <Text style={{ color: currentTheme.textLight, fontSize: 12 }}>Current Weight:</Text>
              <Text style={{ color: currentTheme.textLight, fontWeight: '700', fontSize: 12 }}>
                {currentUser?.weight ? `${currentUser.weight} KG` : 'Not Tracked'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, borderBottomWidth: 0.5, borderColor: currentTheme.border, paddingBottom: 6 }}>
              <Text style={{ color: currentTheme.textLight, fontSize: 12 }}>Live BMI Score:</Text>
              <Text style={{ color: currentTheme.textLight, fontWeight: '700', fontSize: 12 }}>
                {currentUser?.bmiScore ? currentUser.bmiScore : '--'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: currentTheme.textLight, fontSize: 12 }}>Fitness Status:</Text>
              <View style={{ paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: getStatusBadgeColor(currentUser?.healthStatus) }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 10 }}>
                  {currentUser?.healthStatus || 'PENDING'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Dynamic Device Application Theme Changer Switch Area Option Box */}
      <View style={{ paddingHorizontal: 16, marginBottom: 15 }}>
        <TouchableOpacity 
          style={{ 
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            padding: 14, borderRadius: 14, backgroundColor: isDarkMode ? 'rgba(214, 189, 152, 0.08)' : 'rgba(0, 168, 255, 0.08)',
            borderWidth: 1, borderColor: accentColor
          }} 
          onPress={toggleTheme}
        >
          <Text style={{ color: currentTheme.textLight, fontWeight: '700', fontSize: 13 }}>App Interface Theme</Text>
          <Text style={{ fontSize: 13 }}>{isDarkMode ? '🌙 Dark Active' : '☀️ Light Active'}</Text>
        </TouchableOpacity>
      </View>

      {/* Renders default navigation options dynamically below status metrics */}
      <DrawerItemList {...props} />

      {/* User Explicit Logout Operational Terminal Action Controls Container */}
      <View style={{ marginTop: 25, paddingHorizontal: 16 }}>
        <TouchableOpacity 
          style={{ padding: 14, borderRadius: 14, backgroundColor: 'rgba(239, 68, 68, 0.08)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' }} 
          onPress={() => {
            if (props.navigation) props.navigation.replace('Login');
          }}
        >
          <Text style={{ color: '#EF4444', fontWeight: '800', textAlign: 'center', fontSize: 13 }}>Logout Session 🚪</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

/**
 * DrawerNavigator: High-level sidebar container structural router mapping logic layout views.
 */
function DrawerNavigator() {
  const { currentTheme } = useAppTheme();
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right', 
        headerShown: false,
        drawerStyle: { backgroundColor: currentTheme.secondary, width: 380 },
      }}
    >
      <Drawer.Screen name="HomeTabs" component={TabNavigator} options={{ title: 'Dashboard Portal 🏠' }} />
    </Drawer.Navigator>
  );
}

// AppNavigator: Root level processing architecture state map navigator index route.
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DrawerNavigator} />
      <Stack.Screen name="WorkoutCategory" component={WorkoutCategoryScreen} />
      <Stack.Screen name="DailyTrackingGym" component={DailyTrackingGymScreen} />
      <Stack.Screen name="DailyTrackingFitness" component={DailyTrackingFitnessScreen} />
      <Stack.Screen name="DailyTrackingCardio" component={DailyTrackingCardioScreen} />
    </Stack.Navigator>
  );
}