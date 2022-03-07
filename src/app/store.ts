import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import panelReducer from '../layout/layoutSlice';
import statusReducer from '../data/statusSlice';
import dynamicReducer from '../dynamic/dynamicSlice';
import spriteReducer from '../sprite/spriteSlice';
export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'sprite/installSprite'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['status.world'],
        // Ignore these paths in the state
        ignoredPaths: [
            'status.world'
        ],
      },
    }),
  reducer: {
    panel: panelReducer,
    status: statusReducer,
    dynamic: dynamicReducer,
    sprite: spriteReducer,
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
