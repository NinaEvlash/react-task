import { configureStore } from '@reduxjs/toolkit';

import selectedItemReducer from '../features/selectedItem/selectedItemSlice';

export const store = configureStore({
  reducer: {
    selectedItem: selectedItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
