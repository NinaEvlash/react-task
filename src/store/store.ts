import { configureStore } from '@reduxjs/toolkit';
import formsReducer from './formsSlice';
import countriesReducer from './countriesSlice';

export const store = configureStore({
  reducer: {
    forms: formsReducer,
    countries: countriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
