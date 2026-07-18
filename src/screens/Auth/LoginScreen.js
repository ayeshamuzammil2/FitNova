import { useMemo, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { useAppTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { globalStyles } from '../../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const { currentTheme } = useAppTheme();
  const { loginUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const styles = useMemo(() => globalStyles(currentTheme), [currentTheme]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setModalMsg("Please enter your email and password.");
      setModalVisible(true);
      return;
    }

    const res = await loginUser(email, password);

    if (res?.success) {
      showMessage({
        message: "FitNova Athlete Portal Active ⚡",
        description: "Your dynamic training workspace and biometric logs are ready.",
        type: "info",
        backgroundColor: "#1E293B", 
        textColor: "#00A8FF",
        duration: 3000, 
        icon: "success",
      });

      setTimeout(() => {
        navigation.replace('Dashboard');
      }, 3100); 
    } else {
      setModalMsg(res?.message || "Invalid email or password.");
      setModalVisible(true);
    }
  };

  return (
    /* Main Screen Wrapper: background color handle karne aur absolute center karne ke liye */
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: currentTheme.background, padding: 20 }}>
      
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.widget, styles.modalWidget, { maxWidth: 560 }]}>
            <Text style={[styles.widgetTitle, styles.modalErrorTitle]}>
              Access Denied ⚠️
            </Text>
            <Text style={[styles.bodyText, styles.modalBodyText]}>
              {modalMsg}
            </Text>
            <TouchableOpacity style={[styles.btn, styles.errorBtn]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.btnText, styles.errorBtnText]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Actual Form Box Component: Width and sizes tightly bound like the screenshot */}
      <View style={{ width: '100%', maxWidth: 450, alignItems: 'center' }}>
        
        {/* Header Typography */}
        <Text style={[styles.logo, { fontSize: 36, letterSpacing: 3, marginBottom: 4 }]}>FitNova</Text>
        <Text style={[styles.subTitle, { fontSize: 11, marginBottom: 28, paddingHorizontal: 0, opacity: 0.7 }]}>
          Premium Athletic Tracker / Aesthetic Personal Experience Platform
        </Text>

        {/* Controlled Size Input Fields */}
        <TextInput
          style={[styles.input, { height: 48, fontSize: 14, borderRadius: 10, marginBottom: 14 }]}
          placeholder="Email Address"
          placeholderTextColor={currentTheme.textGray}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())} 
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { height: 48, fontSize: 14, borderRadius: 10, marginBottom: 18 }]}
          placeholder="Password"
          placeholderTextColor={currentTheme.textGray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.btn, { padding: 14, borderRadius: 10, marginTop: 4 }]} 
          onPress={handleLogin} 
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { fontSize: 15 }]}>Register Identity Account</Text>
        </TouchableOpacity>

        {/* Redirection Link */}
        <TouchableOpacity style={[styles.textLinkBtn, { marginTop: 24 }]} onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
          <Text style={[styles.linkTextGray, { fontSize: 13 }]}>
            Already a verified athlete? <Text style={[styles.linkTextBold, { fontWeight: '700' }]}>Signup Here</Text>
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}