import { createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface PanelState {
  status: 'home' | 'world' | 'vote' | 'market';
}

const initialState: PanelState = {
  status: 'home',
};

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    home: (state) => {
      state.status = "home";
    },
    world: (state) => {
      state.status = "world";
    },
    vote: (state) => {
      state.status = "vote";
    },
    market: (state) => {
      state.status = "market";
    },
  },
});

export const { home, world, vote, market } = panelSlice.actions;

export const selectPanel = (state: RootState) => state.panel.status;

export default panelSlice.reducer;
