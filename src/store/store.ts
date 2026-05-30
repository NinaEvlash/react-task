import { configureStore } from '@reduxjs/toolkit';

import selectedItemReducer from '../features/selectedItem/selectedItemSlice';
import { pokemonApi } from './api';

export const store = configureStore({
  reducer: {
    selectedItem: selectedItemReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
