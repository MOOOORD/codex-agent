 import React from 'react';
 import { StatusBar } from 'expo-status-bar';
 import { NavigationContainer } from '@react-navigation/native';
 import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import { SafeAreaProvider } from 'react-native-safe-area-context';
 import { Ionicons } from '@expo/vector-icons';
 import { Colors } from './src/constants/theme';

 import ChatScreen from './src/screens/ChatScreen';
 import NotesScreen from './src/screens/NotesScreen';
 import SettingsScreen from './src/screens/SettingsScreen';

 const Tab = createBottomTabNavigator();

 export default function App() {
   return (
     <SafeAreaProvider>
       <NavigationContainer>
         <StatusBar style="dark" />
         <Tab.Navigator
           screenOptions={({ route }) => ({
             headerShown: false,
             tabBarIcon: ({ focused, color, size }) => {
               let iconName;
               if (route.name === 'Chat') {
                 iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
               } else if (route.name === 'Notes') {
                 iconName = focused ? 'book' : 'book-outline';
               } else if (route.name === 'Settings') {
                 iconName = focused ? 'settings' : 'settings-outline';
               }
               return <Ionicons name={iconName} size={size} color={color} />;
             },
             tabBarActiveTintColor: Colors.primary,
             tabBarInactiveTintColor: Colors.textLight,
             tabBarStyle: {
               backgroundColor: Colors.surface,
               borderTopColor: Colors.border,
               paddingBottom: 4,
               height: 56,
             },
             tabBarLabelStyle: {
               fontSize: 11,
               fontWeight: '600',
             },
           })}
         >
           <Tab.Screen
             name="Chat"
             component={ChatScreen}
             options={{ tabBarLabel: '聊天' }}
           />
           <Tab.Screen
             name="Notes"
             component={NotesScreen}
             options={{ tabBarLabel: '小记本' }}
           />
           <Tab.Screen
             name="Settings"
             component={SettingsScreen}
             options={{ tabBarLabel: '设置' }}
           />
         </Tab.Navigator>
       </NavigationContainer>
     </SafeAreaProvider>
   );
 }
