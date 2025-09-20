import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import TailSummaryScreen from './src/screens/TailSummaryScreen';
import LiveTrackingScreen from './src/screens/LiveTrackingScreen';
import ReportsScreen from './src/screens/ReportsScreen';

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  TailSummary: { 
    tail: string; 
    summary: any; 
  };
  LiveTracking: undefined;
  Reports: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563EB',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: '✈️ AeroFresh',
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              title: 'Aircraft Search',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="TailSummary"
            component={TailSummaryScreen}
            options={({ route }) => ({
              title: `${route.params.tail} Summary`,
              headerBackTitle: 'Back',
            })}
          />
          <Stack.Screen
            name="LiveTracking"
            component={LiveTrackingScreen}
            options={{
              title: '📡 Live Tracking',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="Reports"
            component={ReportsScreen}
            options={{
              title: '📊 Reports',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}