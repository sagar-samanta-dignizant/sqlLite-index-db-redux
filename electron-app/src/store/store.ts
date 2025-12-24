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

import { UsersState } from './usersSlice';
import { SpacesState } from './spacesSlice';

export interface RootState {
  users: UsersState;
  spaces: SpacesState;
}
export type AppDispatch = typeof store.dispatch;
