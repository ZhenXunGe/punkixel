import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Palette, Dye, basic, red_palette } from  './palette';
import { Weapon, Weapons, weapon_01, weapon_02} from  './weapon';
import { Drawer, World } from "./draw"
import { Alien } from "./alien"

export interface StatusState {
    energy: number;
    punkxiel: number;
    ranking: number;
    pph: number;
    voucher: number;
    contribution: number;
    reward: number;
    palettes: Array<Palette>;
    palette_focus: number;
    dye_focus: number;
    inventory: Array<Weapons>;
    weapon_focus: Weapons;
    world: World;
    viewIndex: number;
    homeIndex: number;
    alien: Alien;
    sketchSignal: number;
}

const initialState: StatusState = {
    energy: 50,
    punkxiel: 1000,
    ranking: 9999,
    pph: 0,
    voucher: 1,
    palettes: [basic, red_palette],
    palette_focus: 0,
    dye_focus: 0,
    contribution: 0,
    reward: 0,
    inventory: [weapon_01, weapon_02],
    weapon_focus: weapon_01,
    world: new World(0),
    homeIndex: 1,
    viewIndex: 0,
    alien: {alienId: 0, pos:0},
    sketchSignal: 0,
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// First, create the thunk
export const updateAlienAsync = createAsyncThunk(
  'alien/updateAlienAsync',
  async (alienId:number, thunkAPI) => {
    await timeout(1000);
    return 1;
  }
)

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    action: (state) => {
      state.energy -= 1;
    },
    pickColor: (state, d) => {
      state.dye_focus = d.payload;
    },

    pickPalette: (state, d) => {
      state.palette_focus = d.payload;
    },

    paintColor: (state, d) => {
      state.pph += d.payload.weight;
    },

    contribute: (state) => {
      if (state.homeIndex != state.viewIndex) {
        state.contribution += 1;
      } else {
        state.reward += 1;
      }
    },

    switchView: (state, d) => {
      state.viewIndex = d.payload;
    },

    signalSketch: (state) => {
      state.sketchSignal ++;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAlienAsync.fulfilled, (meta: StatusState, c) => {
        meta.alien.pos += 5;
      })
  },


});

export const { paintColor, pickColor, pickPalette,
    action, contribute, switchView,
    signalSketch
} = statusSlice.actions;

export const selectEnergy = (state: RootState) => state.status.energy;
export const selectPunkixel= (state: RootState) => state.status.punkxiel;
export const selectRanking = (state: RootState) => state.status.ranking;
export const selectPPH = (state: RootState) => state.status.pph;
export const selectVoucher = (state: RootState) => state.status.voucher;
export const selectContribution = (state: RootState) => state.status.contribution;
export const selectReward = (state: RootState) => state.status.reward;
export const selectDye = (state: RootState) => state.status.dye_focus;

export const selectPalettes = (state: RootState) => state.status.palettes;
export const selectPaletteFocus = (state: RootState) => state.status.palette_focus;

export const selectWeapons= (state: RootState) => state.status.inventory;
export const selectWeaponFocus= (state: RootState) => state.status.weapon_focus;

export const selectHomeIndex = (state: RootState) => state.status.homeIndex;
export const selectWorld = (state: RootState) => state.status.world;
export const selectAlien = (state: RootState) => state.status.alien;
export const selectViewIndex = (state: RootState) => state.status.viewIndex;

export const selectSketchSignal = (state: RootState) => state.status.sketchSignal;

export default statusSlice.reducer;
