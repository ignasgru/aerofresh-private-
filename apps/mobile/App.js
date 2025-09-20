import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const Stack = createNativeStackNavigator();
export default function App() {
    return (_jsx(SafeAreaProvider, { children: _jsxs(NavigationContainer, { children: [_jsx(StatusBar, { style: "auto" }), _jsxs(Stack.Navigator, { initialRouteName: "Home", screenOptions: {
                        headerStyle: {
                            backgroundColor: '#2563EB',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerShadowVisible: false,
                    }, children: [_jsx(Stack.Screen, { name: "Home", component: HomeScreen, options: {
                                title: '✈️ AeroFresh',
                                headerTitleStyle: {
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                },
                            } }), _jsx(Stack.Screen, { name: "Search", component: SearchScreen, options: {
                                title: 'Aircraft Search',
                                headerBackTitle: 'Back',
                            } }), _jsx(Stack.Screen, { name: "TailSummary", component: TailSummaryScreen, options: ({ route }) => ({
                                title: `${route.params.tail} Summary`,
                                headerBackTitle: 'Back',
                            }) }), _jsx(Stack.Screen, { name: "LiveTracking", component: LiveTrackingScreen, options: {
                                title: '📡 Live Tracking',
                                headerBackTitle: 'Back',
                            } }), _jsx(Stack.Screen, { name: "Reports", component: ReportsScreen, options: {
                                title: '📊 Reports',
                                headerBackTitle: 'Back',
                            } })] })] }) }));
}
