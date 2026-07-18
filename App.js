import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

// Imported for global inline overlay alert toast setups
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        {/* Synchronizes the phone's native operating system top status bar items with active screen render modes */}
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent" 
          translucent={true} 
        />
        
        {/* Core application navigation hub managing the screen route stack layout */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
      
      {/* Floating Notification engine mounting warnings or confirmations globally above all viewport screen layers */}
      <FlashMessage 
        position="top" 
        floating={true} 
        statusBarHeight={StatusBar.currentHeight || 30} // Prevents mobile notch configurations from hiding alert headers
      />
    </ThemeProvider>
  );
}