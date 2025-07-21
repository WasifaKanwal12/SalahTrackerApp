// src/reducers/prayerReducer.js

import { createSlice } from '@reduxjs/toolkit';
import { setSelection } from '../actions/prayerActions';

const initialState = {
  prayerData: [-1, -1, -1, -1, -1],
  selections: {
    fajr: { individual: false, jammat: false },
    dhuhr: { individual: false, jammat: false },
    asr: { individual: false, jammat: false },
    maghrib: { individual: false, jammat: false },
    isha: { individual: false, jammat: false },
  },
};

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setSelection, (state, action) => {
      const { prayer, type, value } = action.payload;
      state.selections[prayer][type] = value;

      state.prayerData = [
        state.selections.fajr.individual ? 0 : state.selections.fajr.jammat ? 1 : -1,
        state.selections.dhuhr.individual ? 0 : state.selections.dhuhr.jammat ? 1 : -1,
        state.selections.asr.individual ? 0 : state.selections.asr.jammat ? 1 : -1,
        state.selections.maghrib.individual ? 0 : state.selections.maghrib.jammat ? 1 : -1,
        state.selections.isha.individual ? 0 : state.selections.isha.jammat ? 1 : -1,
      ];
    });
  },
});

export default prayerSlice.reducer;
