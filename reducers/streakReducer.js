import { createSlice } from '@reduxjs/toolkit';
import { fetchStreakData } from '../actions/streakActions';

const initialState = {
  streakCount: 0,
};

const streakSlice = createSlice({
  name: 'streak',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStreakData.fulfilled, (state, action) => {
      state.streakCount = action.payload.streakCount;
    });
  },
});

export default streakSlice.reducer;
