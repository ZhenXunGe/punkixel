import { createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import React from "react";

export interface DialogProps {
  content: React.ReactNode;
  arrow: string;
}

export interface PanelState {
  status: 'home' | 'world' | 'rank' | 'market';
  dialog: Array<DialogProps>;
}

const initialState: PanelState = {
  status: 'home',
  dialog: [],
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
      state.status = "rank";
    },
    market: (state) => {
      state.status = "market";
    },
    closeDialog: (state) => {
      state.dialog = [];
    },
    openDialog: (state, d) => {
      state.dialog = d.payload;
    }
  },
});

export const { home, world, vote, market, closeDialog, openDialog } = panelSlice.actions;

export const selectPanel = (state: RootState) => state.panel.status;
export const selectDialog = (state: RootState) => state.panel.dialog;

export default panelSlice.reducer;
