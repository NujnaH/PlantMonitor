import { configureStore } from '@reduxjs/toolkit';
// Because it's the default export, the name is arbitrary..
import plantsReducerWhat from './plantsSlice';

export const store = configureStore({
  reducer: {
    plants: plantsReducerWhat,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 