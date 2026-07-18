import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  // Imported initializeAuth and getReactNativePersistence to fix the AsyncStorage warning
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { createContext, useContext, useEffect, useState } from 'react';
// Imported AsyncStorage to persist login states on mobile devices safely
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAUDpwBhe6V5XYjniH1QxZQHVMcoLsdH78",
  authDomain: "fitnova-c8f20.firebaseapp.com",
  databaseURL: "https://fitnova-c8f20-default-rtdb.firebaseio.com",
  projectId: "fitnova-c8f20",
  storageBucket: "fitnova-c8f20.firebasestorage.app",
  messagingSenderId: "143361426748",
  appId: "1:143361426748:web:56cd971fdde17d5e0d4a39",
  measurementId: "G-9D4S2RRF4S"
};

// Initialize base Firebase App instance
const app = initializeApp(firebaseConfig);

// Cross-Platform Auth initialization logic to completely remove persistence warnings
const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? undefined // Defaults to browser persistence on Web environment
    : getReactNativePersistence(AsyncStorage) // Uses AsyncStorage targeting Android/iOS environments safely
});

const database = getDatabase(app); 

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor user authentication state mutations over runtime lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        // Read real-time synchronized user profile nodes from Realtime Database
        onValue(userRef, (snapshot) => {
          const dbData = snapshot.val() || {};
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            username: dbData.username || '',
            phone: dbData.phone || '',
            weight: dbData.weight || '',
            height: dbData.height || '',
            bmiScore: dbData.bmiScore || '',
            healthStatus: dbData.healthStatus || ''
          });
          setLoading(false);
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Registers a new user with duplicate identity checking constraints
  const registerUser = async (userData) => {
    const cleanUsername = userData.username.trim();
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanPhone = userData.phone.trim();
    const plainPassword = userData.password;

    // Direct structural validation checks
    if (!cleanEmail.endsWith('@gmail.com')) {
      return { success: false, message: "Invalid email format. Must end with @gmail.com" };
    }

    if (cleanPhone.length !== 11 || isNaN(cleanPhone)) {
      return { success: false, message: "Phone number must be exactly 11 digits." };
    }

    try {
      const usersRef = ref(database, 'users');
      const dbSnapshot = await get(usersRef);
      
      // Look for identical values to prevent duplicate profiles inside data streams
      if (dbSnapshot.exists()) {
        const allUsers = dbSnapshot.val();
        
        for (let id in allUsers) {
          if (allUsers[id].username.toLowerCase() === cleanUsername.toLowerCase()) {
            return { success: false, message: "This username is already taken. Choose another one." };
          }
          if (allUsers[id].email.toLowerCase() === cleanEmail) {
            return { success: false, message: "This email address is already registered." };
          }
          if (allUsers[id].phone === cleanPhone) {
            return { success: false, message: "This phone number is already registered." };
          }
          if (allUsers[id].plainPassword === plainPassword) {
            return { success: false, message: "This password is already used by another user." };
          }
        }
      }

      // Creates the authentic entry inside Firebase Authentication storage
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, plainPassword);
      const uid = userCredential.user.uid; 

      // Creates accompanying relational data profile metadata fields 
      await set(ref(database, 'users/' + uid), {
        username: cleanUsername,
        email: cleanEmail,
        phone: cleanPhone,
        plainPassword: plainPassword, 
        weight: userData.weight || '',
        height: '',
        bmiScore: '',
        healthStatus: 'PENDING',
        createdAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      let errorMessage = "An error occurred during registration.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already registered.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      }
      return { success: false, message: errorMessage };
    }
  };

  // Handles standard sign-in workflows safely
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Invalid email or password." };
    }
  };

  // Resets local global storage states during user logout operations
  const logoutUser = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Push user fitness transaction matrix directly into the Realtime Database tracking branch
  const saveWorkoutLog = async (workoutData) => {
    if (!auth.currentUser) {
      return { success: false, message: "User not authenticated." };
    }
    const uid = auth.currentUser.uid;
    try {
      const workoutRef = ref(database, 'workouts/' + uid);
      const newWorkoutRef = push(workoutRef); 
      
      await set(newWorkoutRef, {
        type: workoutData.type,          
        activity: workoutData.activity, 
        duration: workoutData.duration, 
        calories: workoutData.calories || null,
        timestamp: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, registerUser, loginUser, logoutUser, saveWorkoutLog }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);