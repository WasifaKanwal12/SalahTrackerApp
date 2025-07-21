import { combineReducers } from '@reduxjs/toolkit';
import prayerReducer from './prayerReducer';
import streakReducer from './streakReducer';
import recordReducer from './recordReducer';


const rootReducer = combineReducers({
  prayer: prayerReducer,
  streak: streakReducer,
  records: recordReducer,
});

export default rootReducer;
