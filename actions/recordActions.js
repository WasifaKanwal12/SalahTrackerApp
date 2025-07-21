import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchPrayerRecords = createAsyncThunk('records/fetchPrayerRecords', async () => {
  const dataString = await AsyncStorage.getItem("prayerDates");
  const data = JSON.parse(dataString) || {};

  // Convert data object into an array of key-value pairs
  const prayerData = Object.entries(data).map(([key, value]) => ({
    date: key,
    prayers: value,
  }));

  // Calculate today's date and the current month
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Initialize counts
  const CountsToday = Array(5).fill(0);
  const CountsLast7Days = Array(5).fill(0);
  const CountsMonth = Array(5).fill(0);

  // Filter and calculate counts for today, last 7 days, and current month
  const last7DaysData = prayerData.filter(entry => entry.date !== today).slice(-7);
  const currentMonthData = prayerData.filter(entry => entry.date.startsWith(currentMonth)).filter(entry => entry.date !== today);
  const todayData = prayerData.slice(-1);

  todayData.forEach((data) => {
    data.prayers.forEach((prayer, index) => {
      if (prayer === 0 || prayer === 1) {
        CountsToday[index] += 1;
      }
    });
  });

  last7DaysData.forEach((data) => {
    data.prayers.forEach((prayer, index) => {
      if (prayer === 0 || prayer === 1) {
        CountsLast7Days[index] += 1;
      }
    });
  });

  currentMonthData.forEach((data) => {
    data.prayers.forEach((prayer, index) => {
      if (prayer === 0 || prayer === 1) {
        CountsMonth[index] += 1;
      }
    });
  });

  return {
    prayerCountsToday: CountsToday,
    prayerCountsLast7Days: CountsLast7Days,
    prayerCountsMonth: CountsMonth,
    TotalOfferdPrayerToday: CountsToday.reduce((total, count) => total + count, 0),
    TotalOfferdPrayerLast7Days: CountsLast7Days.reduce((total, count) => total + count, 0),
    TotalOfferdPrayerMonth: CountsMonth.reduce((total, count) => total + count, 0),
  };
});
