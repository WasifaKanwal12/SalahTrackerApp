import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchStreakData = createAsyncThunk('streak/fetchStreakData', async () => {
  const prayerDates = await AsyncStorage.getItem('prayerDates');
  if (prayerDates !== null) {
    const dates = Object.keys(JSON.parse(prayerDates)).sort();
    let streak = 0;
    let today = new Date().toISOString().split('T')[0];
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] !== today) {
        const prayerData = JSON.parse(prayerDates)[dates[i]];
        if (prayerData.every(val => val === 0 || val === 1)) {
          streak++;
        } else {
          streak = 0;
        }
      }
    }
    return { streakCount: streak };
  }
  return { streakCount: 0 };
});
