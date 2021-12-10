import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import panelReducer from '../layout/layoutSlice';
import statusReducer from '../data/statusSlice';

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    status: statusReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
