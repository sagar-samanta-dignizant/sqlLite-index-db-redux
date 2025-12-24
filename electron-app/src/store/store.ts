import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import spacesReducer from './spacesSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    spaces: spacesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
