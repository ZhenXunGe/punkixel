import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Palette, Dye, red_palette, gray_palette, liquid_green_palette, liquid_blue_palette, ColorCategory,} from  './palette';
import { individualWidth } from "./draw"
import { randomMinion } from "./minion";
import getWorld from './world';

export interface StatusState {
    energy: number;
    punkxiel: number;
    contribution: number;
    ranking: number;
    pph: number;
    voucher: number;
    reward: number;
    palettes: Array<ColorCategory>;
    dye_focus: number;
    homeIndex: number;
    inventory: Array<string | null>;
}

const initialState: StatusState = {
    energy: 50,
    punkxiel: 1000,
    contribution: 0,
    ranking: 9999,
    pph: 0,
    voucher: 1,
    palettes: [
      {
        name:"basic",
        palettes: [gray_palette, red_palette]
      },
      {
        name:"spin",
        palettes: [
          liquid_green_palette,
          liquid_blue_palette,]
      },
    ],
    dye_focus: 0,
    reward: 0,
    inventory: [],
    homeIndex: 1,
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateStatus: (state) => {
      let player = getWorld().getPlayer("solo");
      state.punkxiel = player.punkxiel;
      state.inventory = player.inventory;
      let total = 0;
      for (var m of state.inventory) {
        if (m!==null) {
          total += getWorld().getMinion(m).contribution;
        }
      };
      state.contribution = total;
    },
    pickColor: (state, d) => {
      state.dye_focus = d.payload;
    },

    paintColor: (state, d) => {
      state.pph += d.payload.weight;
    },
  },
  extraReducers: (builder) => {
  },


});

export const { paintColor, pickColor,
    updateStatus,
} = statusSlice.actions;

export const selectEnergy = (state: RootState) => state.status.energy;
export const selectPunkixel= (state: RootState) => state.status.punkxiel;
export const selectRanking = (state: RootState) => state.status.ranking;
export const selectPPH = (state: RootState) => state.status.pph;
export const selectVoucher = (state: RootState) => state.status.voucher;
export const selectReward = (state: RootState) => state.status.reward;
export const selectDye = (state: RootState) => state.status.dye_focus;
export const selectPalettes = (state: RootState) => state.status.palettes;
export const selectHomeIndex = (state: RootState) => state.status.homeIndex;
export const selectInventory = (state: RootState) => state.status.inventory;
export const selectContribution = (state: RootState) => state.status.contribution;
export default statusSlice.reducer;
