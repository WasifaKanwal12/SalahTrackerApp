import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import store from './store/store'; // Corrected path for store import
import CalendarScreen from './CalenderScreen'; // Corrected path
import PrayerScreen from './PrayerScreen';   // Corrected path
import StreakScreen from './StreakScreen';   // Corrected path
import PreviousRecordScreen from './PreviousRecordScreen'; // Corrected path



const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Calendar"
          screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: { fontWeight: 'bold', color: '#000000' },
          }}>
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: 'Salah Tracker' }}
          />
          <Stack.Screen
            name="Prayer"
            component={PrayerScreen}
            options={{ title: 'Prayer Times' }}
          />
          <Stack.Screen
            name="Streak"
            component={StreakScreen}
            options={{ title: 'Streak' }}
          />
          <Stack.Screen
            name="Record"
            component={PreviousRecordScreen}
            options={{ title: 'Previous Record' }}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});