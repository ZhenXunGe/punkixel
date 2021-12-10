import { createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Palette, basic, red_palette } from  './palette';
import { Weapon, weapon_01, weapon_02} from  './weapon';

export interface StatusState {
    energy: number;
    punkxiel: number;
    ranking: number;
    pph: number;
    voucher: number;
    palettes: Array<Palette>;
    palette_focus: Palette;
    weapons: Array<Weapon>;
    weapon_focus: Weapon;
}

const initialState: StatusState = {
    energy: 50,
    punkxiel: 1000,
    ranking: 9999,
    pph: 0,
    voucher: 1,
    palettes: [basic, red_palette],
    palette_focus: basic,
    weapons: [weapon_01, weapon_02],
    weapon_focus: weapon_01,
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
export const selectPunkixel= (state: RootState) => state.status.punkxiel;
export const selectRanking = (state: RootState) => state.status.ranking;
export const selectPPH = (state: RootState) => state.status.pph;
export const selectVoucher = (state: RootState) => state.status.voucher;

export const selectPalettes = (state: RootState) => state.status.palettes;
export const selectPaletteFocus = (state: RootState) => state.status.palette_focus;

export const selectWeapons= (state: RootState) => state.status.weapons;
export const selectWeaponFocus= (state: RootState) => state.status.weapon_focus;

export default statusSlice.reducer;
