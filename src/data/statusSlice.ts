import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Palette, Dye, red_palette, gray_palette, liquid_green_palette, liquid_blue_palette,} from  './palette';
import { World, individualWidth } from "./draw"
import { Alien } from "./alien"
import { availableMinions, getMinionById, Minion, randomMinion } from "./minion";

interface ColorCategory {
  name:string;
  palettes: Array<Palette>;
}

export interface StatusState {
    energy: number;
    punkxiel: number;
    ranking: number;
    pph: number;
    voucher: number;
    reward: number;
    palettes: Array<ColorCategory>;
    dye_focus: number;
    world: World;
    viewIndex: number;
    homeIndex: number;
    sketchSignal: number;
    alien: Alien;
    inventory: Array<Minion | null>;
}

const initialState: StatusState = {
    energy: 50,
    punkxiel: 1000,
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
    inventory: [randomMinion(1), randomMinion(1), null, null, null],
    world: new World(0),
    homeIndex: 1,
    viewIndex: 0,
    alien: {alienId: 0, pos:0, status:"run", dizzle:0},
    sketchSignal: 0,
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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

    paintColor: (state, d) => {
      state.pph += d.payload.weight;
    },

    switchView: (state, d) => {
      state.viewIndex = d.payload;
    },

    signalSketch: (state) => {
      state.sketchSignal ++;
    },

    signalAlien: (state, d) => {
      let status = d.payload;
      let def = "run";
      if (status == "run") {
        state.alien.pos += 1;
        if (state.alien.pos >= individualWidth * state.world.instances.length) {
          state.alien.pos = 0;
        }
      }
      if (status == "dizzle") {
        if (state.alien.status!="dizzle") {
          let instance = state.world.getInstanceById(state.viewIndex);
          console.log("drop...", state.viewIndex, instance.info.id);
          instance.info.drops.push(state.alien.pos % individualWidth);
          state.alien.dizzle = 20;
        } else {
          state.alien.dizzle -= 1;
        }
        if (state.alien.dizzle == 0) {
          status = def;
        }
      }
      state.alien.status = status;
    },

    signalPlaceMinion: (state, mId) => {
      let instance = state.world.getInstance(state.viewIndex*individualWidth);
      let minion = getMinionById(availableMinions(state.inventory), mId.payload)!;
      let m = {
        ...minion
      }
      //let m = randomMinion();
      instance.info.minions.push(m);
      //console.log("minion added");
      minion.location = state.viewIndex;
    }
  },
  extraReducers: (builder) => {
  },


});

export const { paintColor, pickColor,
    action, switchView,
    signalSketch, signalAlien, signalPlaceMinion,
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
export const selectWorld = (state: RootState) => state.status.world;
export const selectAlien = (state: RootState) => state.status.alien;
export const selectViewIndex = (state: RootState) => state.status.viewIndex;

export const selectSketchSignal = (state: RootState) => state.status.sketchSignal;
export const selectInventory = (state: RootState) => state.status.inventory;
export const selectLocalMinions = (state: RootState) => {
  let instance = state.status.world.getInstance(state.status.viewIndex*individualWidth);
  return instance.info.minions;
}

export default statusSlice.reducer;
