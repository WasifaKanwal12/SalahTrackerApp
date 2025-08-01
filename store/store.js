// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/rootReducers';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
