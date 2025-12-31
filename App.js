import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './src/localization/i18n';

import WelcomeScreen from './src/screens/WelcomeScreen';
import PinScreen from './src/screens/PinScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    const isFirstTime = await AsyncStorage.getItem('isFirstTime');
    const savedPin = await AsyncStorage.getItem('user_pin');

    if (isFirstTime === null) {
      await AsyncStorage.setItem('isFirstTime', 'false');
      setInitialRoute('Welcome');
    } else if (savedPin) {
      setInitialRoute('Pin');
    } else {
      setInitialRoute('Main');
    }
  };

  if (!initialRoute) {
    return null;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Pin" component={PinScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
