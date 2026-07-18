import { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { useAppTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { globalStyles } from '../../styles/globalStyles';

export default function SignupScreen({ navigation }) {
  const { currentTheme } = useAppTheme();
  const { registerUser } = useUser();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const styles = useMemo(() => globalStyles(currentTheme), [currentTheme]);

  // Processes state updates, sanitizes form credentials and handles errors
  const handleSignup = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const plainPassword = password;

    // Checks for empty parameters before initiating asynchronous network requests
    if (!cleanUsername || !cleanEmail || !cleanPhone || !plainPassword) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    try {
      const res = await registerUser({ 
        username: cleanUsername, 
        email: cleanEmail, 
        phone: cleanPhone, 
        password: plainPassword, 
        weight: null 
      });
      
      if (res?.success) {
        setSuccessMessage("Identity Registered Successfully!");
        
        showMessage({
          message: "Account Created Successfully! 🎉",
          description: `Welcome ${cleanUsername}! Your profile is secured.`,
          type: "success",
          backgroundColor: "#10B981",
          textColor: "#FFFFFF",
          duration: 4000,
          icon: "success",
        });

        // Clear local inputs sequentially upon successful registration completion
        setUsername('');
        setEmail('');
        setPhone('');
        setPassword('');

        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);

      } else {
        setErrorMessage(res?.message || "An unexpected error occurred.");
      }

    } catch (error) {
      console.error("Signup Screen Error: ", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.centerContainer}>
      
      {/* Centralized component block regulating standard widths on web, native devices and tablet viewports.
        This provides structural stability and anchors child alignments cleanly.
      */}
      <View style={{ width: '100%', maxWidth: 440, alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Core identity text components with centered line spacing */}
        <Text style={[styles.logo, { width: '100%', textAlign: 'center' }]}>FitNova</Text>
        <Text style={[styles.subTitle, { width: '100%', textAlign: 'center', paddingHorizontal: 10 }]}>
          Premium Athletic Tracker / Aesthetic Personal Experience Platform
        </Text>

        {/* Text Input Configuration Forms */}
        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          placeholderTextColor={currentTheme.textGray} 
          value={username} 
          onChangeText={setUsername} 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          placeholderTextColor={currentTheme.textGray} 
          value={email} 
          onChangeText={(text) => setEmail(text.toLowerCase())} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Phone Number" 
          placeholderTextColor={currentTheme.textGray} 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad" 
          maxLength={11} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor={currentTheme.textGray} 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />

        {/* Validation Feedback Placeholders */}
        {successMessage ? (
          <Text style={[styles.successText, { textAlign: 'center', width: '100%' }]}>✓ {successMessage}</Text>
        ) : null}

        {errorMessage ? (
          <Text style={[styles.errorText, { textAlign: 'center', width: '100%' }]}>⚠️ {errorMessage}</Text>
        ) : null}

        {/* Core structural registration action triggers */}
        <TouchableOpacity style={styles.btn} onPress={handleSignup} activeOpacity={0.85}>
          <Text style={styles.btnText}>Register Identity Account</Text>
        </TouchableOpacity>

        {/* Navigation fallback shortcuts routing to Login Screen workflows */}
        <TouchableOpacity style={styles.textLinkBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
          <Text style={[styles.linkTextGray, { textAlign: 'center' }]}>
            Already a verified athlete? <Text style={styles.linkTextBold}>Login Here</Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}