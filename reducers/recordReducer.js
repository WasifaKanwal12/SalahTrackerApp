import { createSlice } from '@reduxjs/toolkit';
import { fetchPrayerRecords } from '../actions/recordActions';

const initialState = {
  prayerCountsToday: [],
  prayerCountsLast7Days: [],
  prayerCountsMonth: [],
  TotalOfferdPrayerToday: 0,
  TotalOfferdPrayerLast7Days: 0,
  TotalOfferdPrayerMonth: 0,
  status: 'idle',
  error: null,
};

const recordSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder .addCase(fetchPrayerRecords.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrayerRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prayerCountsToday = action.payload.prayerCountsToday;
        state.prayerCountsLast7Days = action.payload.prayerCountsLast7Days;
        state.prayerCountsMonth = action.payload.prayerCountsMonth;
        state.TotalOfferdPrayerToday = action.payload.TotalOfferdPrayerToday;
        state.TotalOfferdPrayerLast7Days = action.payload.TotalOfferdPrayerLast7Days;
        state.TotalOfferdPrayerMonth = action.payload.TotalOfferdPrayerMonth;
      })
      .addCase(fetchPrayerRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default recordSlice.reducer;
