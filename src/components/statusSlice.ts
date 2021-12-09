import { createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

export interface StatusState {
      energy: number;
      punkxiel: number;
      ranking: number;
      pph: number;
      voucher: number;
}

const initialState: StatusState = {
      energy: 50,
      punkxiel: 1000,
      ranking: 9999,
      pph: 0,
      voucher: 1,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    action: (state) => {
      state.energy -= 1;
    },
  },
});

export const { action } = statusSlice.actions;

export const selectEnergy = (state: RootState) => state.status.energy;

export default statusSlice.reducer;
